import { DynamoDB } from 'aws-sdk';
import { IAccessDataBase } from './interfaces/IAccessDataBase';

export class DynamoDbConfig {
  constructor() {}

  async getSettings(customerId: string): Promise<IAccessDataBase> {
    const documentClient = new DynamoDB.DocumentClient({
      region: process.env.VD_DYNAMODB_REGION,
      accessKeyId: process.env.VD_DYNAMODB_ACCESS_KEY,
      secretAccessKey: process.env.VD_DYNAMODB_SECRET_ACCESS_KEY,
    });
    const { Items, Count } = await documentClient
      .query({
        TableName: 'bit24.customers',
        ProjectionExpression: 'db_settings',
        KeyConditionExpression: '#customer_id = :value',
        ExpressionAttributeNames: {
          '#customer_id': 'customer_id',
        },
        ExpressionAttributeValues: {
          ':value': customerId,
        },
        Limit: 1,
      })
      .promise();
    if (Count === 0) {
      return null;
    }
    return <IAccessDataBase>Items[0]['db_settings'];
  }
}
