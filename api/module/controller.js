import slug from 'slug';

import Module from './model.js';

export const getAll = async (req, res) => {
  try {
    const items = await Module.find();

    res.status(200).send(items);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const create = async (req, res) => {
  try {
    const { name } = req.body;

    const newItem = new Module({ name, slug: slug(name) });
    const item = await newItem.save();

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
    const { name } = req.body;

    const module = await Module.findById(req.params.id);
    Object.assign(module, { name, slug: slug(name) });
    const item = await module.save();

    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const remove = async (req, res) => {
  try {
    await Promise.all(
      req.body.map(async (v) => {
        await Module.findByIdAndDelete(v._id);
      }),
    );

    res.status(200).send(req.body);
  } catch (error) {
    res.status(500).send(error);
  }
};
