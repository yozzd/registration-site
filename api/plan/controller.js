import slug from 'slug';

import Plan from './model.js';

export const getAll = async (req, res) => {
  try {
    const items = await Plan.find().populate('modules');

    res.status(200).send(items);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const create = async (req, res) => {
  try {
    const { name, modules } = req.body;

    const newItem = new Plan({ name, slug: slug(name), modules });
    const item = await newItem.save();
    await item.populate('modules');

    res.status(200).send(item);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({ message: 'Duplicated data, please review your input!' });
    } else {
      res.status(500).send(error);
    }
  }
};

export const update = async (req, res) => {
  try {
    const { name, modules } = req.body;

    const plan = await Plan.findById(req.params.id);
    Object.assign(plan, { name, slug: slug(name), modules });
    const item = await plan.save();
    await item.populate('modules');

    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const remove = async (req, res) => {
  try {
    await Promise.all(
      req.body.map(async (v) => {
        await Plan.findByIdAndDelete(v._id);
      }),
    );

    res.status(200).send(req.body);
  } catch (error) {
    res.status(500).send(error);
  }
};
