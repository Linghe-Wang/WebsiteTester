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
    elif key == "monthly":
        result = fetch_edits_by_month(value)
    elif key == "annually":
        result = fetch_edits_by_year(value)
        
    overview_data = plot_stack_chart(result['edits_each_date'])
    top_projects_data = plot_stack_chart(result['top_n_projects'])
    top_users_data = plot_stack_chart(result['top_n_users'])
    overview_json = json.dumps(overview_data)
    top_projects_json = json.dumps(top_projects_data)
    top_users_json = json.dumps(top_users_data)
    session['overview_json'] = overview_json
    session['top_projects_json'] = top_projects_json
    session['top_users_json'] = top_users_json
    
    return redirect('/main')


@app.route('/project', methods=['GET'])
def project():
    data = get_default_date()
    data["all_pids"] = titles
    data['project_json'] = session.get('project_json')
    data['contributors_json'] = session.get('contributors_json')
    return render_template('project.html', **data)


@app.route('/api/project', methods=['POST'])
def process_project_form():
    console.log(request.form)
    interval = request.form["interval"]
    pid = request.form["projectid"]
    if interval == "weekly":
        date = request.form["week"]
        result = project_edits_by_week(date, pid)
    elif interval == "monthly":
        date = request.form["month"]
        result = project_edits_by_month(date, pid)
    elif interval == "annually":
        date = request.form["year"]
        result = project_edits_by_year(date, pid)

    one_project_data = plot_stack_chart(result['edits_each_date'])
    contributors_data = plot_chart(result['users'])
    project_json = json.dumps(one_project_data)
    contributors_json = json.dumps(contributors_data)
    session['project_json'] = project_json
    session['contributors_json'] = contributors_json

    return redirect('/project')


@app.route('/user', methods=['GET'])
def user():
    all_uids = distinct_usernames()
    data = get_default_date()
    data["all_uids"] = all_uids
    data['user_json'] = session.get('user_json')
    data['contributions_json'] = session.get('contributions_json')
    return render_template('user.html', **data)


@app.route('/api/user', methods=['POST'])
def process_user_form():
    console.log(request.form)
    interval = request.form["interval"]
    uid = request.form["userid"]
    if interval == "weekly":
        date = request.form["week"]
        result = user_edits_by_week(date, uid)
    elif interval == "monthly":
        date = request.form["month"]
        result = user_edits_by_month(date, uid)
    elif interval == "annually":
        date = request.form["year"]
        result = user_edits_by_year(date, uid)

    one_user_data = plot_stack_chart(result['edits_each_date'])
    contributions_data = plot_chart(result['projects'])
    user_json = json.dumps(one_user_data)
    contributions_json = json.dumps(contributions_data)
    session['user_json'] = user_json
    session['contributions_json'] = contributions_json

    return redirect('/user')


@app.route('/monitor', methods=['GET'])
def monitor():
    return render_template('monitor.html')


# @app.route('/create', methods=('POST'))
# def create():
#     print(request.method)
#     info = request.get_json(force=True)
#     print("THIS IS THE REQUEST", info)
#     projectID = info["projectID"]
#     writer_action_idx = info["writer_action_idx"]
#     writer_action_offset = info["writer_action_offset"]
#
#     if collection.count_documents({'project': projectID}) > writer_action_idx:
#         min_idx, max_idx, info = generate(projectID, writer_action_idx, writer_action_offset)
#     else:
#         min_idx = -1
#         max_idx = -1
#         info = [{"action": {"file": "400 Error", "text": "POST /create: Invalid Index",
#                             "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')},
#                  "htmls": "POST /create: Invalid Index. The index you entered either too small or too large.",
#                  "user": "Server"}]
#     response = {"min": min_idx, "max": max_idx, "status": "ok", "info": info}
#     response = jsonify(response)



if __name__ == '__main__':
    app.run(debug=True)