import express from "express"
import { PrismaClient , Prisma} from '@prisma/client'

const client = new PrismaClient()
// use `prisma` in your application to read and write data in your DB
const app= express()


app.post("/hooks/catch/:userId/:zapId", async(req,res)=>{
    const userId=req.params.userId;
    const zapId=req.params.zapId;
    const body=req.body;

    console.log('reached here 1')


    await client.$transaction(async (tx: Prisma.TransactionClient)=> {
        const run = await tx.zapRun.create({
            data:{
                zapId: zapId,
                metadata:body,
            }
        })
        console.log('reached here 2')
    
    await tx.zapRunOutbox.create({
        data:{
            zapRunId: run.id
        }

    });

    await client.zapRunOutbox.create({
        data:{
            zapRunId: run.id
        }
    });
    kafka.insert()
    res.json({
        message:"WebHook received"
    })

})
});
app.listen(3000);
