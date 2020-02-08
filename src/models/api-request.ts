import { ApiProperty } from '@nestjs/swagger';

export class ApiRequest {
    // @ApiProperty()
    // chaincode: string;

    @ApiProperty()
    method: string;

    @ApiProperty()
    args: object;

    // @ApiProperty()
    // channel:string
  }
