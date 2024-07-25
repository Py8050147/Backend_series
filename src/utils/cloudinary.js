import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs' // file system module in node js's built-in and file system functionalities, such as reading, writing, and deleting files.



cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
    secure: true
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
      fs.unlinkSync(localFilePath)
      // console.log(fs.unlinkSync(localFilePath))
      return response
   } catch (error) {
    //  throw error
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