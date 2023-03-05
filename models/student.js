const Joi = require('joi');



const studentSchema = Joi.object({
    classe : Joi.string().required(),
    nom: Joi.string().required(),
    moyenne: Joi.number().positive(),
    modules: Joi.array().items(
      Joi.object({
        module: Joi.string().required(),
        note: Joi.number().required()
      })
    ).required()
  });

  const studentupdateSchema = Joi.object({
    classe : Joi.string().required(),
    nom: Joi.string().required(),
    moyenne: Joi.number().positive(),
    modules: Joi.array().items(
      Joi.object({
        module: Joi.string().required(),
        note: Joi.number().required()
      })
    ).required()
  });
 

module.exports.studentSchema=studentSchema;
module.exports.studentupdateSchema=studentupdateSchema;
