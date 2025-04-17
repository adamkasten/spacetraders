import express from 'express';
import session from 'express-session';
import path from 'path';
import crypto from 'crypto';

import { register_user, log_in } from '../server/user.js'
import { get_location_info } from '../server/navigation.js';
import logger from '../server/logger.js'

const router = express.Router();
const uuid = crypto.randomUUID();
let hamburg_token = process.env.HAMBURG_ACCOUNT_TOKEN;

router.get('/', (req, res) => {
    res.send(`${uuid}`);
})

router.get('/register', async (req, res) => {
    try {
        let agent_symbol = req.query.agent_symbol;
        let faction = req.query.faction;
        agent_symbol = agent_symbol.toLocaleUpperCase();
        if (!agent_symbol || !faction) {
            logger.log('error', { message: `agent_symbol or faction not provided.` });
            return res.status(400).send(`Configuration error: Account token for ${acc_name} not found.`);
        }
            let user_registration_token = await register_user(agent_symbol,faction);
            res.send(`${user_registration_info}`);

    } catch (error) {
        logger.log('error', { message: `An internal server error occurred during registration, ${error}` })
        res.status(500).send("An internal server error occurred during registration.");
    }
})

router.get('/login/:name', async (req, res) => {
    try {
        let acc_name = req.params.name;
        acc_name = acc_name.toLocaleUpperCase();
        const acc_token_key = `${acc_name}_ACCOUNT_TOKEN`
        let account_token = process.env[acc_token_key];
        if (!account_token) {
            console.error(`Environment variable ${acc_token_key} not found.`);
            return res.status(400).send(`Configuration error: Account token for ${acc_name} not found.`);
        }
            console.log(`Using token key: ${acc_token_key}`);
            let user_info = await log_in(account_token);
            console.log(`ROUTE LOG: ${JSON.stringify(user_info)}`);
            req.session.user_info = user_info;
            res.redirect(`/${req.params.name}/details`)


    } catch (error) {
        logger.log('error', { message: `An internal server error occurred during registration, ${error}` })
        res.status(500).send("An internal server error occurred during registration.");
    }
})

router.get('/:name/details', (req, res) => {
    try {
        let acc_name = req.params.name;
        acc_name = acc_name.toLocaleUpperCase();
        const user_info = req.session.user_info;
        if (user_info) {
            console.log("User Info from session:", user_info);
            res.json(user_info);
        } else {
        }
    } catch (error) {
        logger.log('error', { message: `An internal server error occurred during registration, ${error}` })
        res.status(500).send("An internal server error occurred during registration.");
    }
})

router.get('/:name/navigation', async (req, res) => {
    try {
        let acc_name = req.params.name;
        acc_name = acc_name.toLocaleUpperCase();
        const user_info = req.session.user_info;
        if (user_info) {
            console.log("User Info from session:", user_info);
            console.log(user_info.data.headquarters);
            let headquarters_waypoint = user_info.data.headquarters;
            let headers_system = `${headquarters_waypoint.split("-")[0]}-${headquarters_waypoint.split("-")[1]}`;
            console.log(headers_system);
            let location_info = await get_location_info(headers_system, headquarters_waypoint);
            res.json(location_info);
        } else {
        }
    } catch (error) {
        logger.log('error', { message: `An internal server error occurred during registration, ${error}` })
        res.status(500).send("An internal server error occurred during registration.");
    }
})




export default router;