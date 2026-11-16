`anthropic-sdk.js` ialah SDK rasmi `@anthropic-ai/sdk@1.2.0` yang di-bundle untuk browser:

    npm i @anthropic-ai/sdk@1.2.0 esbuild
    echo 'export { default } from "@anthropic-ai/sdk";' > entry.js
    npx esbuild entry.js --bundle --format=esm --minify --platform=browser --outfile=vendor/anthropic-sdk.js
