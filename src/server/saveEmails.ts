const fs = require("fs")


export const saveEmails = (req: any, res: any, next: any) => {

    if (req.method === 'POST') {

        const body: any = []
        req.on('data', (chunk: any) => {
            body.push(chunk)
        })
        req.on('end', ()=> {
            const parsedBody = Buffer.concat(body).toString()
            const { email } = JSON.parse(parsedBody)
            const date = new Date
            const time = `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`
            const msg = `${email},${time},${date.getHours()}:${date.getMinutes()}\n`

            fs.appendFile('preorder.csv', msg, function(error: any) {
                if (error) throw new Error
            })
        })
        res.end()
    }
}