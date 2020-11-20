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
            const time = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
            const msg = `${email},${time},${date.getUTCHours()}:${date.getMinutes()}\n`

            fs.appendFile('preorder.csv', msg, function(error: any) {
                if (error) throw new Error
            })
        })
        res.end()
    }
}