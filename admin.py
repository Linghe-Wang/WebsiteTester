from flask import Flask, render_template, redirect, send_from_directory
from flask import request
from flask import jsonify
from overview_data import *
from project_data import *

app = Flask(__name__)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.root_path,
                               'resources/images/favicon.ico',
                               mimetype='image/vnd.microsoft.icon')


@app.route('/resources/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.root_path + '/resources', filename)


@app.route('/', methods=['GET'])
@app.route('/main', methods=['GET'])
def index():
    current_date = datetime.now()
    year, current_week = current_date.isocalendar()[:2]
    year = str(year)
    current_week = str(current_week)
    default_week = year + "-W" + current_week

    month = str(current_date.month)
    default_month = year + "-" + month

    data = {'maxweek': default_week, 'maxmonth': default_month}
    return render_template('main.html', **data)


@app.route('/api/main', methods=['POST'])
def process_form():
    key, value = next(request.form.items())
    if key == "weekly":
        fetch_edits_by_week(value)
    return redirect('/main')


@app.route('/project', methods=['GET'])
def project():
    all_pids = distinct_projects()
    return render_template('project.html', all_pids=all_pids)


if __name__ == '__main__':
    app.run(debug=True)