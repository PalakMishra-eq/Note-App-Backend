import { Response } from 'express';
import Note from '../models/noteModel';

export const createNote = async (req: any, res: Response) => {
  try {

    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      createdBy: req.user.id,
    });

    await note.save();
    res.status(201).json({
      message: 'Note created successfully',
      data: note,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating note:', error.message);
      res.status(500).json({
        error: 'Error creating note',
        details: error.message,
      });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
  
};


export const getNotes = async (req: any, res: Response) => {
  try {
    const notes = await Note.find({ createdBy: req.user.id }).sort({ createdAt: -1 }).limit(3);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notes' });
  }
};

export const getAllNotes = async (req: any, res: Response) => {
  try {
    const notes = await Note.find({ createdBy: req.user.id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching all notes' });
  }
};

// // Get a particular note by ID
// export const getNoteDetails = async (req: Request, res: Response): Promise<void> =>  {
//   try {
//     const { id } = req.params;
//     const { createdBy } = req.query;  // Assume createdBy is passed as a query parameter

//     const note = await Note.findOne({ _id: id, createdBy });

//     if (!note) {
//      res.status(404).json({ error: 'Note not found' });
//      return;
//     }

//     res.status(200).json(note);   } catch (error) {
//     console.error('Error fetching note details:', error);
//     res.status(500).json({ error: 'Error fetching note details' });
//   }
// };