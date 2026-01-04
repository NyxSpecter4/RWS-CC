#!/bin/bash

# Leila Farm Vercel Deployment Script
# Run this after authenticating with `vercel login`

set -e

echo "🚀 Starting Leila Farm deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel@latest
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged into Vercel. Please run:"
    echo "   vercel login"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Vercel CLI is installed and authenticated"

# Create vercel.json if it doesn't exist
if [ ! -f "vercel.json" ]; then
    cat > vercel.json << EOF
{
  "name": "leila-farm",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key"
  }
}
EOF
    echo "✅ Created vercel.json configuration"
fi

# Deploy to production
echo "📦 Deploying to Vercel..."
echo "📝 Project will be created as 'leila-farm'"

# Try to deploy with custom project name
vercel --prod --yes 2>&1 | tee deployment.log

# Check if deployment was successful
if grep -q "Production Deployment" deployment.log || grep -q "Ready" deployment.log; then
    echo "✅ Deployment initiated successfully!"
    
    # Try to get the deployment URL
    DEPLOYMENT_URL=$(grep -o "https://[a-zA-Z0-9.-]*\.vercel\.app" deployment.log | head -1)
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        echo ""
        echo "🎉 DEPLOYMENT SUCCESSFUL!"
        echo "🌐 Production URL: $DEPLOYMENT_URL"
        echo ""
        echo "📋 Next steps:"
        echo "1. Visit $DEPLOYMENT_URL to verify deployment"
        echo "2. Check Sidebar for Supabase connection status"
        echo "3. Test mobile responsiveness"
        echo ""
        echo "🔧 If you need to add environment variables:"
        echo "   vercel env add NEXT_PUBLIC_SUPABASE_URL"
        echo "   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "   vercel --prod"
    else
        echo "⚠️  Deployment started but URL not captured in logs."
        echo "   Check Vercel dashboard for deployment status:"
        echo "   https://vercel.com/dashboard"
    fi
else
    echo "❌ Deployment may have failed. Check deployment.log for details."
    echo "   You can also try manual deployment:"
    echo "   vercel --prod"
fi

echo ""
echo "📚 Full deployment guide available in DEPLOYMENT_GUIDE.md"