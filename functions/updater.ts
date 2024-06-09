import { Role } from '../../types/User';
import { validationResult } from 'express-validator';
import { Response } from 'express';
import asyncHandler from 'express-async-handler';

export function getUpdateHandle<Type>({
                                          access,
                                          DbModel,
                                          props,
                                          onCreate = async () => {
                                          },
                                          onUpdate = async () => {
                                          },
                                          onAccess = async () => true,
                                          onFinish = async () => {
                                          },
                                          onPreSave = async () => {
                                          },
                                          excludeProps = new Set(),
                                      }: {
                                          access: Role[];
                                          props: any;
                                          excludeProps?: Set<string>
                                          DbModel: any;
                                          onUpdate?: (e: Type, req: any) => Promise<void | string>;
                                          onCreate?: (e: Type, req: any) => Promise<void | string>;
                                          onAccess?: (e: Type, req: any) => Promise<boolean>;
                                          onFinish?: (e: Type, req: any, prev: Type) => Promise<void>;
                                          onPreSave?: (e: Type, req: any, prev: Type) => Promise<void>;
                                      },
) {
    const handler = async (req: any, res: Response) => {
        if (!access.includes(req.user.role))
            throw new Error('[403]');

        const errors = validationResult(req);
        if (!errors.isEmpty())
            throw new Error(`[400] Не все поля заполнены`);

        const parameters = props.map((p: any) => p.builder.fields[0]).filter((e: string) => e !== 'id' && !excludeProps.has(e));

        const { id } = req.body;

        if (id) {
            const element = await DbModel.findById(id);

            const hasAccess = await onAccess(element, req);
            if (!hasAccess)
                throw new Error('[403]');

            const oldElement = await DbModel.findById(id);

            if (!element)
                throw new Error('[403]');

            const message = await onUpdate(element, req);

            if (message)
                throw new Error(`[${400}] ${message}`);

            for (let e of parameters)
                element[e] = req.body[e];

            await onPreSave(element, req, oldElement);
            await element.save();
            await onFinish(element, req, oldElement);
        } else {
            const element = new DbModel();

            const hasAccess = await onAccess(element, req);
            if (!hasAccess)
                throw new Error('[403]');

            for (let e of parameters)
                element[e] = req.body[e];

            const message = await onCreate(element, req);

            if (message)
                throw new Error(`[${400}] ${message}`);

            await onPreSave(element, req, {} as Type);
            await element.save();
            await onFinish(element, req, {} as Type);
        }

        res.status(200).json({
            message: 'Успешно сохранено',
            error: false,
        });
    };

    return asyncHandler(handler);
}