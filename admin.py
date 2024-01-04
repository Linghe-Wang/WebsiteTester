from modules.utils import *
from modules.overview_data import fetch_edits_by_week, fetch_edits_by_month, fetch_edits_by_year
from modules.project_data import distinct_projects, project_edits_by_week, project_edits_by_month, project_edits_by_year
from modules.user_data import distinct_usernames, user_edits_by_week, user_edits_by_month, user_edits_by_year
from modules.plot import *

app = Flask(__name__)

app.secret_key = 'qearvgb12345413pibergefwva'


def get_default_date():
    current_date = datetime.now()
    year, current_week = current_date.isocalendar()[:2]
    year = str(year)

    current_week = current_date.strftime('%W')
    current_month = current_date.strftime('%m')

    default_week = year + "-W" + current_week
    default_month = year + "-" + current_month

    data = {'maxweek': default_week, 'maxmonth': default_month}

    return data

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.root_path,
                               'static/images/favicon.ico',
                               mimetype='image/vnd.microsoft.icon')


@app.route('/', methods=['GET'])
@app.route('/main', methods=['GET'])
def index():
    data = get_default_date()
    data['overview_json'] = session.get('overview_json')
    data['top_projects_json'] = session.get('top_projects_json')
    data['top_users_json'] = session.get('top_users_json')

    return render_template('main.html', **data)


@app.route('/api/main', methods=['POST'])
def process_form():
    key, value = next(request.form.items())
    if key == "weekly":
        result = fetch_edits_by_week(value)
    if key == "monthly":
        result = fetch_edits_by_month(value)
    if key == "annually":
        result = fetch_edits_by_year(value)
        
    overview_data = plot_main_bar(result)
    top_projects_data = plot_top_projects(result)
    top_users_data = plot_top_users(result)
    overview_json = json.dumps(overview_data)
    top_projects_json = json.dumps(top_projects_data)
    top_users_json = json.dumps(top_users_data)
    session['overview_json'] = overview_json
    session['top_projects_json'] = top_projects_json
    session['top_users_json'] = top_users_json
    
    return redirect('/main')


@app.route('/project', methods=['GET'])
def project():
    all_pids = distinct_projects()
    data = get_default_date()
    data["all_pids"] = all_pids
    return render_template('project.html', **data)


@app.route('/api/project', methods=['POST'])
def process_project_form():
    console.log(request.form)
    interval = request.form["interval"]
    pid = request.form["projectid"]
    if interval == "weekly":
        date = request.form["week"]
        project_edits_by_week(date, pid)
    if interval == "monthly":
        date = request.form["month"]
        project_edits_by_month(date, pid)
    if interval == "annually":
        date = request.form["year"]
        project_edits_by_year(date, pid)
    return redirect('/project')


@app.route('/user', methods=['GET'])
def user():
    all_uids = distinct_usernames()
    data = get_default_date()
    data["all_uids"] = all_uids
    return render_template('user.html', **data)


@app.route('/api/user', methods=['POST'])
def process_user_form():
    console.log(request.form)
    interval = request.form["interval"]
    uid = request.form["userid"]
    if interval == "weekly":
        date = request.form["week"]
        user_edits_by_week(date, uid)
    if interval == "monthly":
        date = request.form["month"]
        user_edits_by_month(date, uid)
    if interval == "annually":
        date = request.form["year"]
        user_edits_by_year(date, uid)
    return redirect('/user')

if __name__ == '__main__':
    app.run(debug=True)