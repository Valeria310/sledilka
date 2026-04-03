import express, { Request, Response } from 'express';
import cors from 'cors';
import { DateTime } from 'luxon';

import prisma from './prisma/prisma.js';
import Joi from 'joi';
import chalk from 'chalk';
async function main() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get('/get_buses', async (req, res) => {
        try {
            const buses = await prisma.bus.findMany();
            const currentDate = new Date();
            res.json(
                buses.map((el) => {
                    let startDate;
                    let startTotalMileage;
                    if (el.lastEnteringDate >= el.oilChangeDate) {
                        startDate = el.lastEnteringDate;
                        startTotalMileage = el.lastEnteredTotalCount;
                    } else {
                        startDate = el.oilChangeDate;
                        startTotalMileage = el.oilChangeMileage;
                    }
                    const [day, month, year] = startDate.toLocaleDateString().split('.');
                    const targetDate = new Date(`${year}-${month}-${day}`);
                    const differenceInTime = (currentDate as any) - (targetDate as any);
                    const mileageAfterLastOilChange =
                        Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)) * el.mileage +
                        startTotalMileage;
                    return {
                        id: el.id,
                        mileage: el.mileage,
                        totalMileage: el.totalMileage,
                        number: el.number,
                        oilChangeDate: el.oilChangeDate,
                        oilChangeMileage: el.oilChangeMileage,
                        mileageBeforeNotif: el.mileageBeforeNotif,
                        isBus: el.isBus,
                        mileageForChange:
                            (el.isBus ? 15000 : 10000) +
                            el.oilChangeMileage -
                            mileageAfterLastOilChange,
                    };
                }),
            );
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.post('/add_bus', async (req, res) => {
        const {
            addingBusNumb,
            addingBusMileage,
            addingBusTotalMileage,
            addingBusOilChangeDate,
            addingBusOilChangeMileage,
            addingBusMileageBeforeNotif,
            isBus,
        } = req.body;
        try {
            await prisma.bus.create({
                data: {
                    mileage: addingBusMileage,
                    number: addingBusNumb,
                    totalMileage: addingBusTotalMileage,
                    oilChangeDate: new Date(addingBusOilChangeDate),
                    mileageBeforeNotif: addingBusMileageBeforeNotif,
                    oilChangeMileage: addingBusOilChangeMileage,
                    lastEnteredTotalCount: addingBusTotalMileage,
                    lastEnteringDate: new Date(),
                    isBus: isBus,
                },
            });
            res.status(200).send('ok');
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.post('/change_bus', async (req, res) => {
        const bus = req.body;
        try {
            await prisma.bus.update({
                where: {
                    id: bus.id,
                },
                data: bus.totalMileage
                    ? {
                          mileage: +bus.mileage,
                          totalMileage: +bus.totalMileage,
                          lastEnteredTotalCount: +bus.totalMileage,
                          oilChangeDate: new Date(bus.oilChangeDate),
                          mileageBeforeNotif: +bus.mileageBeforeNotif,
                          oilChangeMileage: +bus.oilChangeMileage,
                          lastEnteringDate: new Date(),
                      }
                    : {
                          mileage: +bus.mileage,
                          oilChangeDate: new Date(bus.oilChangeDate),
                          mileageBeforeNotif: +bus.mileageBeforeNotif,
                          oilChangeMileage: +bus.oilChangeMileage,
                      },
            });
            res.status(200).send('ok');
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.post('/delete_bus', async (req, res) => {
        const { id } = req.body;
        try {
            await prisma.bus.delete({
                where: {
                    id: id,
                },
            });
            res.status(200).send('ok');
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.get('/get_notifs', async (req, res) => {
        try {
            const buses = await prisma.bus.findMany();
            const currentDate = new Date();
            const needToChangeOilBuses = buses
                .filter((el) => {
                    let startDate;
                    let startTotalMileage;
                    if (el.lastEnteringDate >= el.oilChangeDate) {
                        startDate = el.lastEnteringDate;
                        startTotalMileage = el.lastEnteredTotalCount;
                    } else {
                        startDate = el.oilChangeDate;
                        startTotalMileage = el.oilChangeMileage;
                    }
                    const [day, month, year] = startDate.toLocaleDateString().split('.');
                    const targetDate = new Date(`${year}-${month}-${day}`);
                    const differenceInTime = (currentDate as any) - (targetDate as any);
                    const mileageAfterLastOilChange =
                        Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)) * el.mileage +
                        startTotalMileage;
                    if (
                        mileageAfterLastOilChange >=
                        (el.isBus ? 15000 : 10000) + el.oilChangeMileage - el.mileageBeforeNotif
                    ) {
                        return true;
                    }
                    return false;
                })
                .map((el) => {
                    let startDate;
                    let startTotalMileage;
                    if (el.lastEnteringDate >= el.oilChangeDate) {
                        startDate = el.lastEnteringDate;
                        startTotalMileage = el.lastEnteredTotalCount;
                    } else {
                        startDate = el.oilChangeDate;
                        startTotalMileage = el.oilChangeMileage;
                    }
                    const [day, month, year] = startDate.toLocaleDateString().split('.');
                    const targetDate = new Date(`${year}-${month}-${day}`);
                    const differenceInTime = (currentDate as any) - (targetDate as any);
                    const mileageAfterLastOilChange =
                        Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)) * el.mileage +
                        startTotalMileage;
                    return {
                        number: el.number,
                        mileageForChange:
                            (el.isBus ? 15000 : 10000) +
                            el.oilChangeMileage -
                            mileageAfterLastOilChange,
                        daysForChange: Math.ceil(
                            ((el.isBus ? 15000 : 10000) +
                                el.oilChangeMileage -
                                mileageAfterLastOilChange) /
                                el.mileage,
                        ),
                    };
                });
            res.json(needToChangeOilBuses);
        } catch (error) {
            res.status(400).send('Ошибка запроса');
        }
    });

    app.get('/get_categories', async (req, res) => {
        try {
            const types = await prisma.detailType.findMany();
            res.json(Array.from(new Set(types.map((el) => el.category))));
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.get('/get_detailsTypes', async (req, res) => {
        try {
            const types = await prisma.detailType.findMany();
            res.json(types);
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.post('/add_detailType', async (req, res) => {
        const { typeName, category } = req.body;
        try {
            await prisma.detailType.create({
                data: {
                    name: typeName,
                    category: category,
                },
            });
            res.status(200).send('ok');
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.post('/change_detailType', async (req, res) => {
        const { typeId, category } = req.body;
        try {
            await prisma.detailType.update({
                where: {
                    id: typeId,
                },
                data: {
                    category: category,
                },
            });
            res.status(200).send('ok');
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.post('/getDeteilsByType', async (req, res) => {
        const { id } = req.body;
        try {
            const details = await prisma.detail.findMany({
                where: {
                    typeId: id,
                },
            });
            res.json(details);
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.post('/add_detail', async (req, res) => {
        const { type, quantity, name } = req.body;
        try {
            const prevDetail = await prisma.detail.findFirst({
                where: {
                    typeId: type,
                    name: name,
                },
            });
            if (prevDetail) {
                await prisma.detail.update({
                    where: {
                        id: prevDetail.id,
                    },
                    data: {
                        quantity: prevDetail.quantity + quantity,
                        inStock: true,
                    },
                });
            } else {
                await prisma.detail.create({
                    data: {
                        typeId: type,
                        quantity: quantity,
                        name: name,
                    },
                });
            }
            res.status(200).send('ok');
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.post('/get_detailById', async (req, res) => {
        const { id } = req.body;
        try {
            await prisma.detail.findFirst({
                where: {
                    id: id,
                },
            });
            res.status(200).send('ok');
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.post('/writeOff_detail', async (req, res) => {
        const { id, busId, quantity } = req.body;
        try {
            const prevDetail = await prisma.detail.findFirst({
                where: {
                    id: id,
                },
            });
            if (prevDetail && prevDetail.quantity - quantity > 0) {
                await prisma.detail.update({
                    where: {
                        id: id,
                    },
                    data: {
                        quantity: prevDetail.quantity - quantity,
                    },
                });
            } else {
                await prisma.detail.update({
                    where: {
                        id: id,
                    },
                    data: {
                        inStock: false,
                        quantity: 0,
                    },
                });
            }
            await prisma.detailsJournal.create({
                data: {
                    detailId: id,
                    busId: busId,
                    quantity: quantity,
                },
            });
            res.status(200).send('ok');
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.post('/get_detailsJournal', async (req, res) => {
        const { from, to } = req.body;
        try {
            const fromDate = new Date(`${from}T00:00:00.000Z`);
            const toDate = new Date(
                new Date(`${to}T00:00:00.000Z`).getTime() + 24 * 60 * 60 * 1000,
            );
            const data = await prisma.detailsJournal.findMany({
                where: {
                    date: {
                        gte: new Date(fromDate),
                        lte: new Date(toDate),
                    },
                },
                include: {
                    bus: {
                        select: {
                            number: true,
                        },
                    },
                    detail: {
                        select: {
                            name: true,
                            type: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
            res.json(data);
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    app.post('/get_detailsJournalByBusId', async (req, res) => {
        const { id, from, to } = req.body;
        try {
            const fromDate = new Date(`${from}T00:00:00.000Z`);
            const toDate = new Date(
                new Date(`${to}T00:00:00.000Z`).getTime() + 24 * 60 * 60 * 1000,
            );
            const data = await prisma.detailsJournal.findMany({
                where: {
                    busId: id,
                    date: {
                        gte: new Date(fromDate),
                        lte: new Date(toDate),
                    },
                },
                include: {
                    bus: {
                        select: {
                            number: true,
                        },
                    },
                    detail: {
                        select: {
                            name: true,
                            type: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
            res.json(data);
        } catch (error) {
            console.error(chalk.red(error));
            res.status(400).send('Ошибка запроса');
        }
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
}

main();
