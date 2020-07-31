const router = require('express').Router()
const Note = require('../models/Note')

router.get('/notes/add', (req , res) => {
    res.render('notes/new-note')
})

router.post('/notes/new-note', async (req , res) => {
    const {title , description} = req.body
    const errors = []
    if(!title){
        errors.push({text: 'insert a title'})
    }
    if(!description){
        errors.push({text: 'insert a description'})
    }
    if (errors.length > 0){
        res.render('notes/new-note', {
            errors,
            title,
            description
        })
    }else {
        const newNote = new Note({title, description})
        await newNote.save()
        req.flash('success_msg', 'Note has been added successfully!')
        res.redirect('/notes')
    }
})

router.get('/notes', async (req, res) => {
    await Note.find().sort({date : 'desc'}).then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                _id: documento._id,
                title: documento.title,
                description: documento.description
            }
          })
        }
        res.render('notes/all-notes', {
 notes: contexto.notes }) 
      })
  })

router.post("/notes/edit", async (req, res) => {
  const { idNote } = req.body;
  await Note.findById(idNote).then((documentos) => {
    const note = {
      _id: documentos._id,
      title: documentos.title,
      description: documentos.description,
    };
    res.render("notes/update-note", {
      note
    });
  });
});

router.put('/notes/update', async (req , res) => {
    const {_id, title, description} = req.body
    const note = req.body
    const errors = []
    if(!title){
        errors.push({text: 'insert a title'})
    }
    if(!description){
        errors.push({text: 'insert a description'})
    }
    if (errors.length > 0){
        
        res.render('notes/update-note', {
            errors, note
        })
    }else {
        await Note.findByIdAndUpdate(_id, {title , description})
        req.flash('success_msg', 'Note has been updated successfully!')
        res.redirect('/notes')
    }
})

//DELETE

router.delete('/notes/delete/:id', async (req, res) => {
    const { id } = req.params
    await Note.findByIdAndDelete(id)
    req.flash('success_msg', 'Note has been deleted successfully!')
    res.redirect('/notes')
})

module.exports = router