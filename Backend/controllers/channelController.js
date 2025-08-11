import Channel from '../models/ChannelModel.js';
import User from '../models/UserModel.js';

export const createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingChannel = await Channel.findOne({ user: req.user._id });
    if (existingChannel) {
      return res.status(400).json({ message: 'User already has a channel' });
    }

    const newChannel = await Channel.create({
      name,
      description,
      user: req.user._id,
    });

    res.status(201).json(newChannel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getChannel = async (req, res) => {
  try {
    const { id } = req.params;

    const channel = await Channel.findById(id).populate('user', 'username email');
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getChannelByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const channel = await Channel.findOne({ user: userId });
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.status(200).json(channel);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};