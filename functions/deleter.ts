import { Role } from "../../types/User";
import { Response } from "express";
import { createLogger } from "./logger";
import asyncHandler from "express-async-handler";

const logger = createLogger(__filename)
export function getDeleteHandle<Type>({
                                          access,
                                          DbModel,
                                          onAccess = async () => true
                                      }: {
                                          access: Role[];
                                          DbModel: any;
                                          onAccess?: (e: Type, req: any) => Promise<boolean>;
                                      }
) {
    const handle = async (req: any, res: Response) => {
        if (!access.includes(req.user.role))
            throw new Error('[403]')

        const { id } = req.params
        const e = await DbModel.findById(id)

        if (!e)
            throw new Error('[404]')

        const hasAccess = await onAccess(e, req)
        if (!hasAccess)
            throw new Error('[403]')

        logger.info(e)
        await e.deleteOne()

        res.status(200).json({
            message: "Успешно удалено",
            error: false,
        })
    }

    return asyncHandler(handle)
}