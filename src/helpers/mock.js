import { faker } from "@faker-js/faker"

export const generateProductMock = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.helpers.arrayElements(),
        code: faker.random.alphaNumeric(6),
        price: parseInt(faker.commerce.price(30, 300, 0)),
        stock: parseInt(faker.random.numeric(2)),
        category: faker.commerce.department(),
        thumbnail: faker.image.imageUrl()
    }
}

generateProductMock()