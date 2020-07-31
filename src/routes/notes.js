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

router.post('/notes/update', async (req , res) => {
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
        await Note.update({_id : _id}, req.body)
        res.redirect('/notes')
    }
})

//DELETE

router.get('/notes/delete/:id', async (req, res) => {
    const { id } = req.params
    await Note.remove({_id: id})
    res.redirect('/notes')
})

module.exports = router