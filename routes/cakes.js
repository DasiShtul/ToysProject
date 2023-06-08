const express= require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const {auth} = require("../middlewares/auth");
const {CakeModel,cakeValid} =require("../models/cakeModel")

router.get("/" , async(req,res)=> {
    let perPage = Math.min(req.query.perPage,20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
  
    try{
      let data = await CakeModel
      .find({})
      .limit(perPage)
      .skip((page - 1)*perPage)
      .sort({[sort]:reverse})
      res.json(data);
    } 
    catch(err){
      
      console.log(err)
      res.status(500).json({msg:"err",err})
    }
  })


  
router.put("/:idEdit", async(req,res) => {
    let valdiateBody = validateCountry(req.body);
    if(valdiateBody.error){
      return res.status(400).json(valdiateBody.error.details)
    }
    try{
      let idEdit = req.params.idEdit
      let data = await CountryModel.updateOne({_id:idEdit},req.body)
      // modfiedCount:1 - אם יש הצלחה
      res.json(data);
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }
  })
  

  
router.post("/",auth, async(req,res) => {
  
  let valdiateBody = cakeValid(req.body);
    if(valdiateBody.error){
      return res.status(400).json(valdiateBody.error.details)
    }
    try{
      
      let cake = new CakeModel(req.body);
      cake.user_id=String(req.tokenData._id);
      console.log(cake);
      // הצפנה חד כיוונית לסיסמא ככה 
      // שלא תשמר על המסד כמו שהיא ויהיה ניתן בקלות
      // לגנוב אותה
      // cake.user_id = await bcrypt.hash(cake.user_id, req.body.user_id)
      // await cake.save();
      // כדי להציג לצד לקוח סיסמא אנונימית
    //   user.password="*****";
      res.status(201).json(cake)
    }
    catch(err){
      // בודק אם השגיאה זה אימייל שקיים כבר במערכת
      // דורש בקומפס להוסיף אינדקס יוניקי
      if(err.code == 11000){
        return res.status(400).json({msg:"Email already in system try login",code:11000})
      }
      console.log(err)
      res.status(500).json({msg:"err",err})
    }
  })
  
  router.delete("/:idDel",auth, async(req,res) => {
    try{
      let idDel = req.params.idDel
      // כדי שמשתמש יוכל למחוק רשומה הוא חייב 
      // שלרשומה יהיה את האיי די ביוזר איי די שלו
      let data = await CakeModel.deleteOne({_id:idDel,user_id:req.tokenData._id})
      // "deletedCount": 1 -  אם יש הצלחה של מחיקה
      res.json(data);
    }
    catch(err){
      console.log(err)
      res.status(500).json({msg:"err",err})
    }
  })

  
// router.post("/login", async(req,res) => {
//   let validBody = cakeValid(req.body);
//   if(validBody.error){
//     // .details -> מחזיר בפירוט מה הבעיה צד לקוח
//     return res.status(400).json(validBody.error.details);
//   }
//   try{
//     // קודם כל לבדוק אם המייל שנשלח קיים  במסד
//     let cake = await CakeModel.findOne({user_id:req.body.user_id})
//     if(!cake){
//       return res.status(401).json({msg:"user id is worng ,code:1"})
//     }
//     // אם הסיסמא שנשלחה בבאדי מתאימה לסיסמא המוצפנת במסד של אותו משתמש
//     let authPassword = await bcrypt.compare(req.body.password,user.password);
//     if(!authPassword){
//       return res.status(401).json({msg:"Password or email is worng ,code:2"});
//     }
//     // מייצרים טוקן שמכיל את האיידי של המשתמש
//     // let newToken = genToken(cake.user_id);
//     // res.json({token:newToken});
//   }
//   catch(err){
//     console.log(err)
//     res.status(500).json({msg:"err",err})
//   }
// })


  module.exports = router;