import express from 'express';
import {promises, existsSync} from 'fs';

const app= express();

app.use(express.json());

const DATA_FILE='shopping-list.json';

app.get('/items', async (request, response) =>{
     const text= await promises.readFile(DATA_FILE, {encoding:'utf8'})
       const shoppingList=JSON.parse(text);

     response.json(shoppingList);

    })

app.put('/items/:index' , async (request,response) => {

    const data= await promises.readFile(DATA_FILE,{encoding:'utf8'})
    const shoppingList=JSON.parse(data)

    const newItem=request.body
    const itemIndex=request.params['index'];

    shoppingList[itemIndex]=newItem;
    await promises.writeFile(DATA_FILE, JSON.stringify(shoppingList) , {encoding:'utf8'})
    response.sendStatus(200);

})

app.delete('items/:index', async (request,response) =>{

    const data=await promises.readFile(DATA_FILE, {encoding:'utf8'})
    const shoppingList=JSON.parse(data)

    const itemIndex=request.params['index']

    shoppingList.splice(itemIndex,1)

    await promises.writeFile(DATA_FILE, JSON.stringify(shoppingList),{encoding:'utf8'})
    response.sendStatus(200);


})

app.post('/items', async (request,response) => {

    const data=await promises.readFile(DATA_FILE, {encoding:'utf8'})
    const shoppingList=JSON.parse(data)

    const newItem=request.body
    shoppingList.push(newItem)

    await promises.writeFile(DATA_FILE,JSON.stringify(shoppingList), {encoding:'utf8'})
    response.sendStatus(200);

})

app.patch('/items/:index', async (request,response) => {

    const data= await promises.readFile(DATA_FILE, {encoding:'utf8'})
    const shoppingList=JSON.parse(data)
    const itemIndex=request.params['index']
    const newQuantity=request.body.quantity;
    shoppingList[itemIndex].quantity=newQuantity;

    await promises.writeFile(DATA_FILE,JSON.stringify(shoppingList),{encoding:'utf8'})
    response.sendStatus(200);

})

if(!existsSync(DATA_FILE)){

    await promises.writeFile(DATA_FILE,JSON.stringify([]),{encoding:'utf8'})

}

const port= 8000;

app.listen(port,() =>{
    console.log( `Server is listening to ${port}`)
} )