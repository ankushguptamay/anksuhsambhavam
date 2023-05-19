const db = require('../Models');
const UserForm = db.userForm;

exports.addUserForm = async (req, res) => {
    try {
        await UserForm.create({
            name: req.body.name,
            gender: req.body.gender,
            mobile_number: req.body.mobile_number,
            whats_app_number: req.body.whats_app_number,
            address_permanent: req.body.address_permanent,
            region_type: req.body.region_type,
            address_current: req.body.address_current,
            annual_parental_income: req.body.annual_parental_income,
            is_pwd: req.body.is_pwd,
            current_profile: req.body.current_profile,
            academic_qualification: req.body.academic_qualification,
            last_college: req.body.last_college,
            last_course: req.body.last_course,
            percentage_10th: req.body.percentage_10th,
            board_10th: req.body.board_10th,
            percentage_12th: req.body.percentage_12th,
            board_12th: req.body.board_12th,
            percentage_graduation: req.body.percentage_graduation,
            other_degree_name: req.body.other_degree_name,
            other_degree_percentage: req.body.other_degree_percentage,
            paper_medium: req.body.paper_medium,
            optional_subject: req.body.optional_subject,
            best_exam_results: req.body.best_exam_results,
            current_coaching_course_name: req.body.current_coaching_course_name,
            current_coaching_institute: req.body.current_coaching_institute,
            preferred_coaching_mode: req.body.preferred_coaching_mode,
            extra_curricular: req.body.extra_curricular,
            justification: req.body.justification,
            how_did_you_know: req.body.how_did_you_know,
            comments: req.body.comments,
            graduationYear: req.body.graduationYear,
            graducationYearInProcess: req.body.graducationYearInProcess,
            isThisFirstAttemptL: req.body.isThisFirstAttempt,
            userProfileId: req.user.id
        })
        res.status(200).send({
            success: 'true',
            message: `User form added successfully!`
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.userForm = async (req, res) => {
    try {
        const userForm = await UserForm.findOne({
            where: {
                userProfileId: req.user.id
            } 
        });
        res.status(200).send(userForm);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}