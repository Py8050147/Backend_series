import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs' // file system in node js

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadonCloudinary = async (localFilePath) => {
   try {
    if (!localFilePath) return null
      //upload the file on cloudinary
     const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
      })
      //file has been uploaded successfully
      console.log("file is uploaded on cloudinary ", response.url)
      return response
   } catch (error) {
     fs.unlinkSync(localFilePath) // remove the localy save temporay file as the upload operation got faild 
     return null
   }
}

export {uploadonCloudinary}

// cloudinary.v2.uploader.upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )