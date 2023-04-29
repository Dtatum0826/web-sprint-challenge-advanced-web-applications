import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { axiosWithAuth } from '../axios'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [currentArticle, setCurrentArticle] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
 
  const redirectToArticles = () => { navigate("/articles") }


  const editArticle = (art) => {
    setCurrentArticleId(art.article_id)
    setCurrentArticle(art)
  }
  const logout = () => {
    // ✨ implement
    localStorage.removeItem('token')
    setMessage("Goodbye!")
    navigate("/")

  }

  const login = ({ username, password }) => {
    // ✨ implement
    setMessage(null)
    setSpinnerOn(true)
    axios.post(loginUrl, { username, password })
      .then(res => {

        localStorage.setItem('token', res.data.token)
        setMessage(res.data.message)
        navigate("/articles")
        setSpinnerOn(false)
      })

  }

  const getArticles = () => {
    // ✨ implement


    setMessage(null)
    setSpinnerOn(true)
    axiosWithAuth().get(articlesUrl)
      .then(res => {
console.log(res,"INSIDE GetArticles")
        setArticles(res.data.articles)
        setMessage(res.data.message)
        setSpinnerOn(false)
      }).catch(err => {
        navigate("/")
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {

    const data = {
      title: article.title,
      text: article.text,
      topic: article.topic
    }
    setMessage(null)
    setSpinnerOn(true)
    axiosWithAuth().post(articlesUrl, data)
      .then(res => {

        setArticles(...articles, res.data.article)

        setSpinnerOn(false)
        axiosWithAuth().get(articlesUrl)
        .then(res => {
  console.log(res,"INSIDE GetArticles")
          setArticles(res.data.articles)
          setSpinnerOn(false)
        }).catch(err => {
          setSpinnerOn(false)
        })
    



        setMessage(res.data.message)
      })
      .catch(err => {
        console.error(err)
      })

  }

  const updateArticle = (values, article_id) => {
    console.log(values, "INside Update", article_id)

    
    setMessage(null)
    setSpinnerOn(true)
    axiosWithAuth().put(`${articlesUrl}/${article_id}`, values)
      .then(res => {
        console.log(res.data.article)

        setArticles(...articles, res.data.article)

      
        setSpinnerOn(false)
        axiosWithAuth().get(articlesUrl)
        .then(res => {
  console.log(res,"INSIDE GetArticles")
          setArticles(res.data.articles)
          setSpinnerOn(false)
        }).catch(err => {
          setSpinnerOn(false)
        })



        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err)
      })
    // You got this!
  }

  const deleteArticle = article_id => {
    // ✨ implement
    const token = localStorage.getItem('token')
    const config = {
      headers: { Authorization: token }
    }
    setMessage(null)
    setSpinnerOn(true)
    axios.delete(`http://localhost:9000/api/articles/${article_id}`, config)
      .then(res => {
        setSpinnerOn(false)

       
          setMessage(res.data.message)
        
        axiosWithAuth().get(articlesUrl)
        .then(res => {
  console.log(res,"INSIDE GetArticles")
          setArticles(res.data.articles)
          setSpinnerOn(false)
        }).catch(err => {
          setSpinnerOn(false)
        })

      })
      .catch(err => {
        console.error(err)
      })

  }
  const redirectToLogin = () => {
    if (!localStorage.getItem('token')) {
      return "/" 
    } else return "/articles" 
  }


  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink  id="articlesScreen" to={()=>redirectToLogin()}>Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm currentArticleId={currentArticleId} currentArticle={currentArticle} postArticle={postArticle} updateArticle={updateArticle} />
              <Articles currentArticleId={currentArticleId} editArticle={editArticle} deleteArticle={deleteArticle} getArticles={getArticles} articles={articles} />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}

