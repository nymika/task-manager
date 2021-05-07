const app = require('./app')

const port = process.env.PORT;

app.listen(port, () => {
    console.log('Server is up on ' + port);
})

// app.post('/users', (req,res) =>
// {
//     res.send('testing!')
// })