     import { registerEnumType } from '@nestjs/graphql';
     
     export enum RequestStatus {
       UNANSWERED = 'UNANSWERED',
       ANSWERED = 'ANSWERED',
       CLOSED = 'CLOSED',
       FINISHED = 'FINISHED'
     }
     
     registerEnumType(RequestStatus, {
       name: 'RequestStatus',
       description: 'Request has one status at a time',
     });
     