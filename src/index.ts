import express, { Express, Request, Response, urlencoded } from 'express'
import './dotenv'
import dbConnect from './utils/dbConnect'
import bodyParser from 'body-parser'
import cors from 'cors'
import categoryRouter from './routers/categoryRouter'
import orchidRouter from './routers/orchidRouter'
import { engine } from 'express-handlebars'
import path from 'path'
import morgan from 'morgan'

const port = process.env.PORT
const dbURL = process.env.DBURL

dbConnect(dbURL)
const app: Express = express()

//catch form data
app.use(bodyParser.json())
app.use(cors())
app.use(
  urlencoded({
    extended: true
  })
)

app.use(morgan('dev'))

//static files
app.use(express.static(path.join(__dirname, 'public')))

//endpoint
app.use('/category', categoryRouter)
app.use('/orchid', orchidRouter)

//view engine
app.engine('handlebars', engine({ defaultLayout: 'main', extname: '.handlebars' }))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req: Request, res: Response) => {
  res.render('home')
})
app.get('*', (req: Request, res: Response) => {
  res.render('error')
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

export default app
