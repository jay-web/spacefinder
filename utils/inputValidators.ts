import Space from "../model/space.schema";

export class MissingFieldError extends Error {};

export function InputValidator(args: any) {
    if(!(args as Space).name){
        throw new MissingFieldError("Value of space name is missing !!! 😑")
    }
    if(!(args as Space).location){
        throw new MissingFieldError("Value of space location is missing !!! 😑")
    }
    if(!(args as Space).spaceId){
        throw new MissingFieldError("Value of space Id is missing !!! 😑")
    }
    
}