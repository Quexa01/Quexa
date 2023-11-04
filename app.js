const express = require('express');
const mongoose = require('mongoose');

const cloudinary = require('cloudinary').v2;
const cloudinary1 = require('cloudinary').v2;
const cloudinary2 = require('cloudinary').v2;
const cloudinary3 = require('cloudinary').v2;
const cloudinary4 = require('cloudinary').v2;

const multer = require('multer');
const app = express();
const request = require('request');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const port = 3000;

app.use(express.urlencoded({ extended: true }));


//Cloudinary connection
//Venkat
cloudinary.config({
    cloud_name: 'dqllyz4my',
    api_key: '312724741957139',
    api_secret: 'Zqyvm-mWMZPjmLoTq2AvhVvG0iU',
    secure: true,
});
          
//Argha
cloudinary1.config({ 
  cloud_name: 'diqj3fxub', 
  api_key: '878618713159762', 
  api_secret: 'A24qGChmv9IxslylYJnl27rpgM0',
  secure: true,
});

//Pujitha
cloudinary2.config({ 
  cloud_name: 'djwmvuh31', 
  api_key: '318549282276473', 
  api_secret: 'D0A03DXhqe3VMegbhQNQwACkzT4',
  secure: true,
});

//Saritha
cloudinary3.config({ 
  cloud_name: 'dncgbpayb', 
  api_key: '719939386372513', 
  api_secret: 'N8y0H5s-LCHpfcXHlVPEoKsGE88',
  secure: true, 
});

//Manideep  
cloudinary4.config({ 
  cloud_name: 'dc1bikc0k', 
  api_key: '496981174375627', 
  api_secret: 'zzy1wyaG6wvk6PBqaxLQ68ZihvM',
  secure: true, 
});

// MongoDB connection
let password = 'quexa';
let user = 'quexavit:';
mongoose.connect('mongodb+srv://' + user + password + '@cluster0.b59pavi.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define MongoDB schemas and models
const downloadSchema = new mongoose.Schema({
    totalDownloads: Number,
});


// MongoDB Schema
const Download = mongoose.model('download', downloadSchema);

const paperIdSchema = new mongoose.Schema({
    currentId: Number,
});


// MongoDB Schema
const PaperId = mongoose.model('PaperId', paperIdSchema);

const postSchema = new mongoose.Schema({
    paperId: Number,
    examDate: String,
    courseCode: String,
    slot: String,
    examType: String,
    verified: Number,
    images: [String], // Store Cloudinary image URLs as strings
});

const courseSchema = new mongoose.Schema({
    courseCode: String,
    courseTitle: String,
})

const Post = mongoose.model('Post', postSchema);
const Course = mongoose.model('Course', courseSchema);


// Home route
app.get('/', (req, res) => {
    res.render('home.ejs');
});

//Searching Route
app.get('/search', (req, res) => {
    res.render('search.ejs');
});

app.post('/search', async function (req, res) {
    const courseCode = req.body.courseCode;
    const examType = req.body.examType;
    const year = req.body.year;

    const query = {};

    if (courseCode) {
        query.courseCode = courseCode;
    }

    if (examType) {
        query.examType = examType;
    }

    if (year) {
        query.year = year;
    }
    let complete= '/display?' + new URLSearchParams(query).toString()
    res.redirect(complete);
});

//Uploading Route
app.get('/upload', (req, res) => {
    res.render('upload.ejs');
});

app.post('/upload', upload.array('image'), async (req, res) => {
    try {
        let { courseCode, date, slot, type } = req.body;

        courseCode = courseCode.toUpperCase();

        const existingVerifiedPost = await Post.findOne({
            courseCode,
            examDate: date,
            slot,
            examType: type,
            verified: 1,
        });

        if (existingVerifiedPost) {
            return res.status(400).render('errorupload', { error: 'A verified paper already exists with the same details.' });
        }

        // Retrieve and update the paper ID
        const paperIdDoc = await PaperId.findOne();
        let currentPaperId = 1;

        if (paperIdDoc) {
            currentPaperId = paperIdDoc.currentId;
            currentPaperId = (currentPaperId % 10000) + 1;
        }


        const existingUnverifiedPost = await Post.findOne({
            paperId: currentPaperId,
        });

        if (existingUnverifiedPost) {
            for (const imageUrl of existingUnverifiedPost.images) {
                const publicId = imageUrl.match(/\/v(\d+)\/([^/]+)/)[2].replace('.png', '');
                if (publicId) {
                    if(existingUnverifiedPost.paperId%5===0){
                    cloudinary.config({
                        cloud_name: 'dqllyz4my',
                        api_key: '312724741957139',
                        api_secret: 'Zqyvm-mWMZPjmLoTq2AvhVvG0iU',
                        secure: true,
                    });
                    cloudinary.uploader.destroy(publicId, (result) => {
                        //console.log(result);
                    });}
                    if(existingUnverifiedPost.paperId%5===1){
                    cloudinary1.config({ 
                        cloud_name: 'diqj3fxub', 
                        api_key: '878618713159762', 
                        api_secret: 'A24qGChmv9IxslylYJnl27rpgM0',
                        secure: true,
                        });
                    cloudinary1.uploader.destroy(publicId, (result) => {
                        //console.log(result);
                    });}
                    if(existingUnverifiedPost.paperId%5===2){
                    cloudinary2.config({ 
                        cloud_name: 'djwmvuh31', 
                        api_key: '318549282276473', 
                        api_secret: 'D0A03DXhqe3VMegbhQNQwACkzT4',
                        secure: true,
                        });
                    cloudinary2.uploader.destroy(publicId, (result) => {
                        //console.log(result);
                    });}
                    if(existingUnverifiedPost.paperId%5===3){
                    cloudinary3.config({ 
                        cloud_name: 'dncgbpayb', 
                        api_key: '719939386372513', 
                        api_secret: 'N8y0H5s-LCHpfcXHlVPEoKsGE88',
                        secure: true, 
                        });
                    cloudinary3.uploader.destroy(publicId, (result) => {
                        //console.log(result);
                    });}
                    if(existingUnverifiedPost.paperId%5===4){
                    cloudinary4.config({ 
                        cloud_name: 'dc1bikc0k', 
                        api_key: '496981174375627', 
                        api_secret: 'zzy1wyaG6wvk6PBqaxLQ68ZihvM',
                        secure: true, 
                        });
                    cloudinary4.uploader.destroy(publicId, (result) => {
                        //console.log(result);
                    });}
                }
            }
            await Post.deleteOne({ _id: existingUnverifiedPost._id });
        }

        
        // Update the paper ID in the database
        if (paperIdDoc) {
            paperIdDoc.currentId = currentPaperId;
            await paperIdDoc.save();
        } else {
            await PaperId.create({ currentId: currentPaperId });
        }

        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
              const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

              let result;

              if (currentPaperId % 5 === 0) {
                cloudinary.config({
                    cloud_name: 'dqllyz4my',
                    api_key: '312724741957139',
                    api_secret: 'Zqyvm-mWMZPjmLoTq2AvhVvG0iU',
                    secure: true,
                });
                result = await cloudinary.uploader.upload(dataUri);
              } else if (currentPaperId % 5 === 1) {
                cloudinary1.config({ 
                    cloud_name: 'diqj3fxub', 
                    api_key: '878618713159762', 
                    api_secret: 'A24qGChmv9IxslylYJnl27rpgM0',
                    secure: true,
                  });
                result = await cloudinary1.uploader.upload(dataUri);
              } else if (currentPaperId % 5 === 2) {
                cloudinary2.config({ 
                    cloud_name: 'djwmvuh31', 
                    api_key: '318549282276473', 
                    api_secret: 'D0A03DXhqe3VMegbhQNQwACkzT4',
                    secure: true,
                  });
                result = await cloudinary2.uploader.upload(dataUri);
              } else if (currentPaperId % 5 === 3) {
                cloudinary3.config({ 
                    cloud_name: 'dncgbpayb', 
                    api_key: '719939386372513', 
                    api_secret: 'N8y0H5s-LCHpfcXHlVPEoKsGE88',
                    secure: true, 
                  });
                result = await cloudinary3.uploader.upload(dataUri);
              } else if (currentPaperId % 5 === 4) {
                cloudinary4.config({ 
                    cloud_name: 'dc1bikc0k', 
                    api_key: '496981174375627', 
                    api_secret: 'zzy1wyaG6wvk6PBqaxLQ68ZihvM',
                    secure: true, 
                  });
                result = await cloudinary4.uploader.upload(dataUri);
              }
          
              return result.secure_url;
            })
          );
          

        const post = new Post({
            paperId: currentPaperId,
            examDate: date,
            courseCode,
            slot,
            examType: type,
            verified: 0,
            images: uploadedImages,
        });

        await post.save();

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

//Verify Route
app.get('/verify', async (req, res) => {
    try {
        const posts = await Post.find({ verified: 0 }).select('courseCode examDate slot examType paperId');
        res.render('verify.ejs', { posts });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.post('/verify', async (req, res) => {
    try {
        const { courseCode, examDate, slot, action, examType } = req.body;


        if (action === 'accept') {
            await Post.findOneAndUpdate({ courseCode, examDate, slot, examType }, { verified: 1 });
            
            const unverifiedPosts = await Post.find({
                courseCode,
                examDate,
                slot,
                examType: examType,
                verified: 0,
            });
            
            for (const post of unverifiedPosts) {
                for (const imageUrl of post.images) {
                    const publicId = imageUrl.match(/\/v(\d+)\/([^/]+)/)[2].replace('.png', '');
                    if (publicId) {
                        if(post.paperId%5===0){
                        cloudinary.config({
                            cloud_name: 'dqllyz4my',
                            api_key: '312724741957139',
                            api_secret: 'Zqyvm-mWMZPjmLoTq2AvhVvG0iU',
                            secure: true,
                        });
                        cloudinary.uploader.destroy(publicId, (result) => {
                            //console.log(result);
                        });}
                        if(post.paperId%5===1){
                        cloudinary1.config({ 
                            cloud_name: 'diqj3fxub', 
                            api_key: '878618713159762', 
                            api_secret: 'A24qGChmv9IxslylYJnl27rpgM0',
                            secure: true,
                            });
                        cloudinary1.uploader.destroy(publicId, (result) => {
                            //console.log(result);
                        });}
                        if(post.paperId%5===2){
                        cloudinary2.config({ 
                            cloud_name: 'djwmvuh31', 
                            api_key: '318549282276473', 
                            api_secret: 'D0A03DXhqe3VMegbhQNQwACkzT4',
                            secure: true,
                            });
                        cloudinary2.uploader.destroy(publicId, (result) => {
                            //console.log(result);
                        });}
                        if(post.paperId%5===3){
                        cloudinary3.config({ 
                            cloud_name: 'dncgbpayb', 
                            api_key: '719939386372513', 
                            api_secret: 'N8y0H5s-LCHpfcXHlVPEoKsGE88',
                            secure: true, 
                            });
                        cloudinary3.uploader.destroy(publicId, (result) => {
                            //console.log(result);
                        });}
                        if(post.paperId%5===4){
                        cloudinary4.config({ 
                            cloud_name: 'dc1bikc0k', 
                            api_key: '496981174375627', 
                            api_secret: 'zzy1wyaG6wvk6PBqaxLQ68ZihvM',
                            secure: true, 
                            });
                        cloudinary4.uploader.destroy(publicId, (result) => {
                            //console.log(result);
                        });}
                    }
                }
                await Post.deleteOne({ _id: post._id });
            }
            
            res.redirect('/verify');
        } else if (action === 'decline') {
            const post = await Post.findOne({ courseCode, examDate, slot });
            if (post) {
                for (const imageUrl of post.images) {
                    const publicId = imageUrl.match(/\/v(\d+)\/([^/]+)/)[2].replace('.png', '');
                    if (publicId) {
                        if(post.paperId%5===0){
                        cloudinary.config({
                            cloud_name: 'dqllyz4my',
                            api_key: '312724741957139',
                            api_secret: 'Zqyvm-mWMZPjmLoTq2AvhVvG0iU',
                            secure: true,
                        });
                        cloudinary.uploader.destroy(publicId, (result) => {
                            //console.log(result);
                        });}
                        if(post.paperId%5===1){
                        cloudinary1.config({ 
                            cloud_name: 'diqj3fxub', 
                            api_key: '878618713159762', 
                            api_secret: 'A24qGChmv9IxslylYJnl27rpgM0',
                            secure: true,
                            });
                        cloudinary1.uploader.destroy(publicId, (result) => {
                            //console.log(result);
                        });}
                        if(post.paperId%5===2){
                        cloudinary2.config({ 
                            cloud_name: 'djwmvuh31', 
                            api_key: '318549282276473', 
                            api_secret: 'D0A03DXhqe3VMegbhQNQwACkzT4',
                            secure: true,
                            });
                        cloudinary2.uploader.destroy(publicId, (result) => {
                            //console.log(result);
                        });}
                        if(post.paperId%5===3){
                        cloudinary3.config({ 
                            cloud_name: 'dncgbpayb', 
                            api_key: '719939386372513', 
                            api_secret: 'N8y0H5s-LCHpfcXHlVPEoKsGE88',
                            secure: true, 
                            });
                        cloudinary3.uploader.destroy(publicId, (result) => {
                            //console.log(result);
                        });}
                        if(post.paperId%5===4){
                        cloudinary4.config({ 
                            cloud_name: 'dc1bikc0k', 
                            api_key: '496981174375627', 
                            api_secret: 'zzy1wyaG6wvk6PBqaxLQ68ZihvM',
                            secure: true, 
                            });
                        cloudinary4.uploader.destroy(publicId, (result) => {
                            //console.log(result);
                        });}
                    }
                }
                await Post.deleteOne({ courseCode, examDate, slot });
            }
            res.redirect('/verify');
        } else {
            res.status(400).send('Invalid action');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/verify/images', async (req, res) => {
    try {
        const { courseCode, date, slot, examType} = req.query;
        const post = await Post.findOne({ courseCode, examDate: date, slot, examType });

        if (post) {
            res.render('verifyImages.ejs', { images: post.images, courseCode, examDate: date, slot, examType});
        } else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

//Downloading
app.post('/download', async (req, res) => {
    try {
        const { courseCode, examDate, slot } = req.body;
        const post = await Post.findOne({ courseCode, examDate, slot });

        if (post && post.images.length > 0) {
            const doc = new PDFDocument();

            const pdfFileName = `${courseCode}_${examDate}_${slot}.pdf`;
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${pdfFileName}`);

            doc.pipe(res);

            for (const imageUrl of post.images) {
                if (imageUrl) {

                    // Download the image and embed it in the PDF using axios
                    try {
                        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                        if (response.status === 200) {
                            const imageBuffer = response.data;

                            // Embed the image in the PDF with auto scaling to fit the page
                            doc.image(imageBuffer,0,0, {
                                fit: [doc.page.width, doc.page.height],
                                align: 'center',
                                valign: 'center',
                            });
                            doc.addPage();
                        } else {
                            console.error(`Failed to download image: HTTP ${response.status}`);
                        }
                    } catch (error) {
                        console.error(`Error downloading image: ${error.message}`);
                    }
                }
            }

            // Finalize the PDF and send it to the response
            doc.end();

            const down = await Download.findOne();
            let currentDownloads = 1;

            if (down) {
                currentDownloads = down.totalDownloads;
                currentDownloads = currentDownloads + 1;
            }
            if (down) {
                down.totalDownloads = currentDownloads;
                await down.save();
            } else {
                await Download.create({ totalDownloads: currentDownloads });
            }

        } else {
            res.status(404).send('Post not found or has no images.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

//Display 
app.get('/display', async (req, res) => {
    try {
        const query = req.query;
        const posts = await Post.find(query);
        res.render('display.ejs', { posts});
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/display/images', async (req, res) => {
    try {
        const { courseCode, date, slot } = req.query;
        const courses = await Course.find({ courseCode: courseCode });
    

        if (courses) {
            const post = await Post.findOne({ courseCode, examDate: date, slot });
            
            if (post) {
                res.render('displayImages.ejs', { images: post.images, courseCode, examDate: date, slot});
            } else {
                res.status(404).send('Post not found');
            }
        } else {
            res.status(404).send('Course not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

//Course Uploading
app.get('/uploadCourse', (req, res) => {
    res.render('uploadCourse.ejs');
});

app.post('/uploadCourse', async (req, res) => {
    try {
        const { courseCode, courseTitle } = req.body;

        const existingCourse = await Course.findOne({
            courseCode,
        });

        if (existingCourse) {
            return res.status(400).render('uploadCourse', { error: 'Course already exists' });
        }

        const course = new Course({
            courseCode: courseCode,
            courseTitle: courseTitle,
        });

        await course.save();

        res.redirect('/uploadCourse');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

app.get('/getUniqueCourseCodes', async (req, res) => {
    try {
        const uniqueCourseCodes = await Post.distinct('courseCode');
        res.json(uniqueCourseCodes);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching unique course codes.' });
    }
});




app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
