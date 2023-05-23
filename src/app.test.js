import app, {clearDataFile} from './app.js'
import request from 'supertest'

describe('API Server Test', ()=>{

    beforeEach(() => {
        clearDataFile();
    });

    test('Test getting items', async ()=> {
        const response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([])
    })

    test('Test appending an item', async ()=> {
        const item = {
            name: 'Flour',
            quantity: 1
        }

        let response = await request(app)
            .post('/items')
            .send(item);
        expect(response.statusCode).toBe(200);

        response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([item]));
    })

    // 1. patch
    //     post item
    //     patch with index 0 item with only quantity
    //     get all items and see if there is one with old name and new quantity

    test('Test patch ', async ()=>{

        const newItem={
            name:'onion',
            quantity:3
        }

        await request(app).post('/items').send(newItem)

        const newItemUpdate ={
            quantity:1
        }

        let response = await request(app).patch('/items/0').send(newItemUpdate)
        expect(response.statusCode).toBe(200);

        response= await request(app).get('/items');
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual([{
            name:'onion',
            quantity:1
        }]);


    })

    //2a delete
    test('Test delete  items', async ()=> {

        const newItem={
            name:'Milk',
            quantity: 2
        };

        await request(app).post('/items').send(newItem);


        let response = await request(app).delete('/items/0');
        expect(response.statusCode).toBe(200);

        response = await request(app).get('/items');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);

        // 2b delete with incorrect index
        //     delete item at index 0 - 404

        let response2 = await request(app).delete('/items/0');
        expect(response2.statusCode).toBe(404);


    });

    // 3. put

    test('Test put items (replace old item with new one)',
        async () => {

            const Item = {

                name: 'watermelon',
                quantity: 1

            }

            await request(app).post('/items').send(Item)

            const newItem = {

                name: 'egg',
                quantity: 6
            }

            let response = await request(app).put('/items/0').send(newItem)
            expect(response.statusCode).toBe(200);

            response = await request(app).get('/items');
            expect(response.statusCode).toBe(200)
            expect(response.body).toEqual([{

                name: 'egg',
                quantity: 6
            }])


        })

    // 4. validation

    test('Test some invalid data to get sure validations does work', async ()=>{

        const newItem = {
            name: 'Milk',
            quantity: 2,
        };

        await request(app).post('/items').send(newItem)

        const invalidItem= {
            name:'',
            quantity:-1
        }

        let response= request(app).put('/items/0').send(invalidItem)
        expect(response.statusCode).toBe(400);




    })



    // more test cases


    // 4. validation
})