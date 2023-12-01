/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
   env:{
    DB_URI:"mongodb+srv://alishabbir3151:iloveyoumorethenanythingelse@uncroped.fnfrefx.mongodb.net/bookingapp?retryWrites=true&w=majority",
    SECURE_URL:"CODEWITHEDIFY",
  }
}

module.exports = nextConfig
