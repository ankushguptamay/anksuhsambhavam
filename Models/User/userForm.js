module.exports = (sequelize, DataTypes) => {
    const UserForm = sequelize.define("userForm", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
        },
        mobile_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        whats_app_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address_permanent: {
            type: DataTypes.TEXT,
        },
        region_type: {
            type: DataTypes.STRING,
        },
        address_current: {
            type: DataTypes.TEXT,
        },
        annual_parental_income: {
            type: DataTypes.STRING,
        },
        is_pwd: {
            type: DataTypes.BOOLEAN,
        },
        current_profile: {
            type: DataTypes.STRING,
        },
        academic_qualification: {
            type: DataTypes.STRING,
        },
        graduationYear: {
            type: DataTypes.STRING,
        },
        graducationYearInProcess: {
            type: DataTypes.STRING,
        },
        last_college: {
            type: DataTypes.STRING,
        },
        last_course: {
            type: DataTypes.STRING,
        },
        percentage_10th: {
            type: DataTypes.STRING,
        },
        board_10th: {
            type: DataTypes.STRING,
        },
        percentage_12th: {
            type: DataTypes.STRING,
        },
        board_12th: {
            type: DataTypes.STRING,
        },
        percentage_graduation: {
            type: DataTypes.STRING,
        },
        other_degree_name: {
            type: DataTypes.STRING,
        },
        other_degree_percentage: {
            type: DataTypes.STRING,
        },
        paper_medium: {
            type: DataTypes.STRING,
        },
        optional_subject: {
            type: DataTypes.STRING,
        },
        isThisFirstAttempt: {
            type: DataTypes.STRING,
        },
        best_exam_results: {
            type: DataTypes.STRING,
        },
        current_coaching_course_name: {
            type: DataTypes.STRING,
        },
        current_coaching_institute: {
            type: DataTypes.STRING,
        },
        preferred_coaching_mode: {
            type: DataTypes.STRING,
        },
        extra_curricular: {
            type: DataTypes.TEXT,
        },
        justification: {
            type: DataTypes.TEXT,
        },
        how_did_you_know: {
            type: DataTypes.TEXT,
        },
        comments: {
            type: DataTypes.TEXT,
        },
    })
    return UserForm;
}