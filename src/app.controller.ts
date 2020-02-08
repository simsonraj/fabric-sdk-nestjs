import { Controller, Get, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { enrollAdmin } from './bc-middleware/enrollAdmin';
import { query } from './bc-middleware/query';
import { ApiRequest } from './models/api-request';
import { RolesGuard } from './gaurds/roles.guard';
import { ApiTags, ApiBasicAuth } from '@nestjs/swagger';
import { AppLogger } from './logger/logger';
import { UtilsConfig } from './bc-middleware/utilsconfig';
import { registerUser } from './bc-middleware/users';
import { invoke } from './bc-middleware/invoke';

const controller = 'AppController';

@ApiTags('APIs')
@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private logger: AppLogger
    ) {
    }

    @Get('health')
    async getHealth(): Promise<any> {
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing check application health function.`);
        return this.appService.buildAPIResponse(200, 'App running!', {}, undefined);
    }

    @Get('enrollAdmin')
    @ApiBasicAuth()
    @UseGuards(RolesGuard)
    async enrollAdmin() {
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing enroll admin function.`);
        await enrollAdmin();
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Start Hello`);
        return this.appService.buildAPIResponse(200, 'admin Registered Successfully!', {}, undefined);
    }

    @Post('registerUser')
    @ApiBasicAuth()
    @UseGuards(RolesGuard)
    async registerUser(@Body() apiReq: ApiRequest) {
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing register user function.`);
        if (!apiReq || !apiReq.args || !apiReq.args['userName']) {
            throw new HttpException('userName field missing in the Request', HttpStatus.BAD_REQUEST);
        }
        await registerUser(apiReq.args['userName']);
       return this.appService.buildAPIResponse(200, 'User Registered Successfullyl!', {}, undefined);
    }

    @Post('invoke')
    @ApiBasicAuth()
    @UseGuards(RolesGuard)
    async invoke(@Body() apiReq: ApiRequest) {
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing invoke function.`);
        const result = await invoke('', apiReq['method'], JSON.stringify(apiReq['args']));
        return this.appService.buildAPIResponse(200, 'Invoke Successful!', result, undefined);
    }

    @Post('query')
    @ApiBasicAuth()
    @UseGuards(RolesGuard)
    async query(@Body() apiReq: ApiRequest) {
        this.logger.log(`${new Date().toLocaleString()}: [${controller}] Initializing query function.`);
        let queryRes: any = {};
        if (typeof apiReq.args === 'string') {
            queryRes = await query('', apiReq.method, apiReq.args);
        } else {
            queryRes = await query('', apiReq.method, JSON.stringify(apiReq.args));
        }
        return this.appService.buildAPIResponse(200, '', queryRes, undefined);
    }

    @Post('queryByTxnId')
    @ApiBasicAuth()
    @UseGuards(RolesGuard)
    async queryByTxnId(@Body() apiReq: ApiRequest) {
        const utilsConfig = UtilsConfig.getInstance();
        const queryRes = await utilsConfig.getByTxID(apiReq.args['txID']);
        console.log(queryRes);
        return this.appService.buildAPIResponse(200, '', JSON.parse(queryRes), undefined);
    }
}
