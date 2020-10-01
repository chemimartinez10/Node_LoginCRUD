const router = require('express').Router()
const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth')


router.get('/notes/add', isAuthenticated, (req , res) => {
    res.render('notes/new-note')
})

router.post('/notes/new-note', isAuthenticated , async (req , res) => {
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
        newNote.user = req.user.id
        await newNote.save()
        req.flash('success_msg', 'Note has been added successfully!')
        res.redirect('/notes')
    }
})

router.get('/notes', isAuthenticated, async (req, res) => {
    await Note.find({user: req.user.id}).sort({date : 'desc'}).then(documentos => {
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

router.post("/notes/edit", isAuthenticated, async (req, res) => {
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

router.put('/notes/update', isAuthenticated, async (req , res) => {
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

router.delete('/notes/delete/:id',isAuthenticated, async (req, res) => {
    const { id } = req.params
    await Note.findByIdAndDelete(id)
    req.flash('success_msg', 'Note has been deleted successfully!')
    res.redirect('/notes')
})

module.exports = router