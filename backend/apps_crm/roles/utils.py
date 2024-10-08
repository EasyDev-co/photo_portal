def check_user_access(user, department, region):
    if user.employee.department == department and user.employee.region == region:
        return True
    return False
