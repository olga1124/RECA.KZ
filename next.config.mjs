/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_SERVICE_ID: process.env.NEXT_PUBLIC_SERVICE_ID,
        NEXT_PUBLIC_TEMPLATE_NEW_LEAD: process.env.NEXT_PUBLIC_TEMPLATE_NEW_LEAD,
        NEXT_PUBLIC_USER_ID: process.env.NEXT_PUBLIC_USER_ID,
        NEXT_PUBLIC_TEMPLATE_UPLOAD_CV: process.env.NEXT_PUBLIC_TEMPLATE_UPLOAD_CV
      },
};

export default nextConfig;
