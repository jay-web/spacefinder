import {AuthService} from "./authService";
import { Config } from "./config";


const authService = new AuthService();

const user = authService.login(Config.TEST_USER_NAME, Config.TEST_USER_PASSWORD)