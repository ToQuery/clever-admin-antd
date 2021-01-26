import {Request, Response} from "express";

export default {
  'POST /api/user/info': async (req: Request, res: Response) => {
    const {password, userName, type} = req.body;
    if ((password === 'ant.design' || password === 'admin') && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if ((password === 'ant.design' || password === 'admin') && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/user/token': async (req: Request, res: Response) => {
    const {password, userName, type} = req.body;
    if ((password === 'ant.design' || password === 'admin') && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if ((password === 'ant.design' || password === 'admin') && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    if (type === 'mobile') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
}
