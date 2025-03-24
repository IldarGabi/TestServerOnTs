import express from 'express';
import mongoose from 'mongoose';
import router from './serverRouter';
const PORT = process.env.PORT || 3000

const testApp = express();

testApp.use(express.json());
testApp.use('/auth', router);

const startServer = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/testBd')
        testApp.listen(PORT, () => console.log(`test server started success on localhost:${PORT}`));
    } catch (error) {
        console.log(error)
    }
}

export default startServer()