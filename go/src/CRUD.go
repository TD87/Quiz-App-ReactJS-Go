package main

import (
    "fmt"
    a "./auth" //Back-end authentication logic

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin" //gin router
    "github.com/jinzhu/gorm" //gorm for the database
    _ "github.com/jinzhu/gorm/dialects/sqlite" //sqlite for gorm
)

//schema for quizes for each genre
type Quiz struct{
    ID uint `json:"id"`
    Genre string `json:"genre"`
    Quizname string `json:"quizname"`
}

//schema for questions for each quiz
type Question struct{
    ID uint `json:"id"`
    Quizid uint `json:"quizid"`
    Questionname string `json:"questionname"`
}

//schema for choices for each question
type Choice struct{
    ID uint `json:"id"`
    Quizid uint `json:"quizid"`
    Questionid uint `json:"questionid"`
    Choicename string `json:"choicename"`
    Correct string `json:"correct"`
}

//attempted quizes of all users
type History struct{
    ID uint `json:"id"`
    Uname string `json:"uname"`
    Quizname string `json:"quizname"`
    Genre string `json:"genre"`
    Score uint `json:"score"`
}

var db *gorm.DB

func main(){
    a.WebTokenMW()  //initialise the json web token middleware
    var err error
    db, err = gorm.Open("sqlite3", "./gorm.db")
    if err != nil {
        fmt.Println(err)
    }
    defer db.Close()

    db.AutoMigrate(&Quiz{},&Question{},&Choice{}, &History{}) //add the schemas
    db.Model(&Quiz{}).AddUniqueIndex("idx_quizname","quizname"); //all quiznames have to be unique
    r := gin.Default()
    r.GET("/quiz/", a.AuthMiddleware(), GetQuizes)
    r.GET("/quiz/:genre", a.AuthMiddleware(), GetQuizByGenre)
    r.POST("/quiz/", a.AuthMiddleware(), AddQuiz)
    r.DELETE("/quiz/:id", a.AuthMiddleware(), DeleteQuiz)
    r.PUT("/quiz/:id", a.AuthMiddleware(), UpdateQuiz)

    r.GET("/question/", a.AuthMiddleware(), GetQuestions)
    r.GET("/question/:quizid", a.AuthMiddleware(), GetQuestionByQuiz)
    r.POST("/question/", a.AuthMiddleware(), AddQuestion)
    r.DELETE("/question/:id", a.AuthMiddleware(), DeleteQuestion)
    r.PUT("/question/:id", a.AuthMiddleware(), UpdateQuestion)

    r.GET("/choice/", a.AuthMiddleware(), GetChoices)
    r.GET("/choice/:questionid", a.AuthMiddleware(), GetChoiceByQuestion)
    r.POST("/choice/", a.AuthMiddleware(), AddChoice)
    r.DELETE("/choice/:id", a.AuthMiddleware(), DeleteChoice)
    r.PUT("/choice/:id", a.AuthMiddleware(), UpdateChoice)

    r.GET("/history/", a.AuthMiddleware(), GetHistory)
    r.GET("/history/:genre", a.AuthMiddleware(), GetHistoryByGenre)
    r.GET("/uhistory/:uname", a.AuthMiddleware(), GetHistoryByUname)
    r.POST("/history/", a.AuthMiddleware(), AddHistory)

    r.POST("/admin/", a.AuthMiddleware(), CheckAdmin)

    //Allow the authorization property in the request header
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowHeaders = []string{"Authorization"}
    r.Use((cors.New(config)))
    r.Run(":8080")
}

//Sent to gain access to admin panel
func CheckAdmin(c *gin.Context){
    var name string
    c.BindJSON(&name);
    if name == "teja.dhondu@gmail.com" {
        c.Header("access-control-allow-origin", "*")
        c.JSON(200, name)
    } else {
        c.Header("access-control-allow-origin", "*")
        c.JSON(404, name)
    }
}

//Delete a quiz. Deletes all related questions and choices
func DeleteQuiz(c *gin.Context){
    id := c.Params.ByName("id")
    var quiz Quiz
    var question Question
    var choice Choice

    db.Where("id = ?", id).Delete(&quiz)
    db.Where("quizid = ?", id).Delete(&question)
    db.Where("quizid = ?", id).Delete(&choice)
    c.Header("access-control-allow-origin", "*")
    c.JSON(200, gin.H{"id #" + id: "deleted"})
}

//Add a quiz
func AddQuiz(c *gin.Context){
    var quiz Quiz
    var exitStatus int = 200
    c.BindJSON(&quiz)
    if db.Create(&quiz).Error != nil {
        exitStatus = 404
    }
    c.Header("access-control-allow-origin", "*")
    c.JSON(exitStatus, quiz)
}

//Get all quizes of a specific genre
func GetQuizByGenre(c *gin.Context){
    genre := c.Params.ByName("genre")
    var quizes []Quiz
    if err := db.Where("genre = ?", genre).Find(&quizes).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    } else {
        c.Header("access-control-allow-origin", "*")
        c.JSON(200, quizes)
    }
}

//get all quizes of all genres
func GetQuizes(c *gin.Context){
    var quizes []Quiz
    if err := db.Find(&quizes).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    } else {
        c.Header("access-control-allow-origin", "*")
        c.JSON(200, quizes)
    }
}

//update quizname
func UpdateQuiz(c *gin.Context){
    id := c.Params.ByName("id")
    var quiz Quiz
    c.BindJSON(&quiz)
    if err := db.Model(&quiz).Where("id = ?", id).Update("quizname", quiz.Quizname).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    }
    c.Header("access-control-allow-origin", "*")
    c.JSON(200, quiz)
}

//delete a question from a quiz
func DeleteQuestion(c *gin.Context){
    id := c.Params.ByName("id")
    var question Question
    var choice Choice

    db.Where("id = ?", id).Delete(&question)
    db.Where("questionid = ?", id).Delete(&choice)
    c.Header("access-control-allow-origin", "*")
    c.JSON(200, gin.H{"id #" + id: "deleted"})
}

//add a question to a quiz
func AddQuestion(c *gin.Context){
    var question Question
    var exitStatus int = 200
    c.BindJSON(&question)
    if db.Create(&question).Error != nil {
        exitStatus = 404
    }
    c.Header("access-control-allow-origin", "*")
    c.JSON(exitStatus, question)
}

//get questions for a specific quiz
func GetQuestionByQuiz(c *gin.Context){
    quizid := c.Params.ByName("quizid")
    var questions []Question
    if err := db.Where("quizid = ?", quizid).Find(&questions).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    } else {
        c.Header("access-control-allow-origin", "*")
        c.JSON(200, questions)
    }
}

//get all questions from all quizes
func GetQuestions(c *gin.Context){
    var questions []Question
    if err := db.Find(&questions).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    } else {
        c.Header("access-control-allow-origin", "*")
        c.JSON(200, questions)
    }
}

//update question name
func UpdateQuestion(c *gin.Context){
    id := c.Params.ByName("id")
    var question Question
    c.BindJSON(&question)
    if err := db.Model(&question).Where("id = ?", id).Update("questionname", question.Questionname).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    }
    c.Header("access-control-allow-origin", "*")
    c.JSON(200, question)
}

//delete a choice of a question
func DeleteChoice(c *gin.Context){
    id := c.Params.ByName("id")
    var choice Choice
    db.Where("id = ?", id).Delete(&choice)
    c.Header("access-control-allow-origin", "*")
    c.JSON(200, gin.H{"id #" + id: "deleted"})
}

//add a choice to a question
func AddChoice(c *gin.Context){
    var choice Choice
    var exitStatus int = 200
    c.BindJSON(&choice)
    if db.Create(&choice).Error != nil {
        exitStatus = 404
    }
    c.Header("access-control-allow-origin", "*")
    c.JSON(exitStatus, choice)
}

//get all choices for a specific question
func GetChoiceByQuestion(c *gin.Context){
    questionid := c.Params.ByName("questionid")
    var choices []Choice
    if err := db.Where("questionid = ?", questionid).Find(&choices).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    } else {
        c.Header("access-control-allow-origin", "*")
        c.JSON(200, choices)
    }
}

//get all choices for all questions
func GetChoices(c *gin.Context){
    var choices []Choice
    if err := db.Find(&choices).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    } else {
        c.Header("access-control-allow-origin", "*")
        c.JSON(200, choices)
    }
}

//update choice name
func UpdateChoice(c *gin.Context){
    id := c.Params.ByName("id")
    var choice Choice
    c.BindJSON(&choice)
    if err := db.Model(&choice).Where("id = ?", id).Update("choicename", choice.Choicename).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    }
    c.Header("access-control-allow-origin", "*")
    c.JSON(200, choice)
}

//add attempted quiz along with score and user name. Request sent after user attempts a quiz
func AddHistory(c *gin.Context){
    var history History
    var exitStatus int = 200
    c.BindJSON(&history)
    if db.Create(&history).Error != nil {
        exitStatus = 404
    }
    c.Header("access-control-allow-origin", "*")
    c.JSON(exitStatus, history)
}

//get attempted quizes by a specific genre. Used by leaderboard
func GetHistoryByGenre(c *gin.Context){
    genre := c.Params.ByName("genre")
    var history []History
    if err := db.Order("score desc").Where("genre = ?", genre).Find(&history).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    } else {
        c.Header("access-control-allow-origin", "*")
        c.JSON(200, history)
    }
}

//get attempted quizes by username. Used by view history
func GetHistoryByUname(c *gin.Context){
    uname := c.Params.ByName("uname")
    var history []History
    if err := db.Where("uname = ?", uname).Find(&history).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    } else {
        c.Header("access-control-allow-origin", "*")
        c.JSON(200, history)
    }
}

//get all attempted quizes for all genres. Used by leaderboard
func GetHistory(c *gin.Context){
    var history []History
    if err := db.Order("score desc").Find(&history).Error; err != nil {
        c.AbortWithStatus(404)
        fmt.Println(err)
    } else {
        c.Header("access-control-allow-origin", "*")
        c.JSON(200, history)
    }
}
