import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Constants } from '../../constants';

const clientsModule = ClientsModule.register([
    {
        name: Constants.MICROSERVICE_NAME,
        transport: Transport.REDIS
    }
]);

@Global()
@Module({
    imports: [clientsModule],
    exports: [clientsModule]
})
export class EventModule {}
