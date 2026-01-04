const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const pdf = require('pdf-parse');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/api/parse-document', async (req, res) => {
  try {
    const form = formidable({});
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file?.[0];
    const documentType = fields.documentType?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    if (!documentType || !['lease', 'vendor'].includes(documentType)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    const pdfBuffer = fs.readFileSync(file.filepath);
    const pdfData = await pdf(pdfBuffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'PDF contains no extractable text' });
    }

    const prompt = documentType === 'lease'
      ? `You are a commercial real estate analyst. Extract all key terms from this lease document. Return a valid JSON object with the following fields: tenant_name (string), start_date (YYYY-MM-DD), end_date (YYYY-MM-DD), base_rent (number), escalation_rate (number). Do not include any extra text. Document text:\n\n${text}`
      : `You are a commercial real estate analyst. Extract all key terms from this vendor contract. Return a valid JSON object with the following fields: vendor_name (string), start_date (YYYY-MM-DD), end_date (YYYY-MM-DD), scope (string), rate (number). Do not include any extra text. Document text:\n\n${text}`;

    const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that returns only JSON, no other text.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      console.error('DeepSeek API error:', deepseekResponse.status, errorText);
      return res.status(500).json({ error: 'AI parsing failed', details: errorText });
    }

    const deepseekData = await deepseekResponse.json();
    const content = deepseekData.choices[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'AI returned no content' });
    }

    let extracted;
    try {
      extracted = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', content);
      return res.status(500).json({ error: 'AI returned invalid JSON', raw: content });
    }

    fs.unlinkSync(file.filepath);

    res.status(200).json(extracted);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});