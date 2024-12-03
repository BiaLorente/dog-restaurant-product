import { AttributeValue } from '@aws-sdk/client-dynamodb';

export type DynamoDBItem = Record<string, AttributeValue>;
