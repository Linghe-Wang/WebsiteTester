from .utils import *

import matplotlib.pyplot as plt
from itertools import cycle


def generate_category_colors(num_categories):
    if not isinstance(num_categories, int) or num_categories <= 0:
        raise ValueError("Number of categories must be a positive integer.")

    # Use matplotlib's default color cycle to generate distinct colors
    color_cycle = cycle(plt.rcParams['axes.prop_cycle'].by_key()['color'])

    # Generate a list of distinct colors based on the number of categories
    colors = [next(color_cycle) for _ in range(num_categories)]

    return colors


def plot_main_bar(result):
    dates = []
    pids = []

    edits_each_date = result["edits_each_date"]

    for key in edits_each_date:
        dates.append(key)

    for date in dates:
        for pid in edits_each_date[date][1]:
            if (pid not in pids) and (pid != "null"):
                pids.append(pid)

    bar_data = []
    stack_color = generate_category_colors(len(pids))
    for pid in pids:
        edits = []
        for date in dates:
            if pid in edits_each_date[date][1]:
                edits.append(edits_each_date[date][1][pid])
            else:
                edits.append(0)
        bar_data.append(edits)

    graph_data = {'labels': dates, 'datasets': []}
    for i in range(len(bar_data)):
        bar = {'label': pids[i], 'data': bar_data[i], 'backgroundColor': stack_color[i], 'borderWidth': 0}
        graph_data['datasets'].append(bar)

    console.log(graph_data)

    return graph_data


def plot_top_projects(result):
    dates = []
    pids = []

    edits_each_date = result["top_n_projects"]

    for key in edits_each_date:
        dates.append(key)

    for date in dates:
        for pid in edits_each_date[date][1]:
            if (pid not in pids) and (pid != "null"):
                pids.append(pid)

    bar_data = []
    stack_color = generate_category_colors(len(pids))
    for pid in pids:
        edits = []
        for date in dates:
            if pid in edits_each_date[date][1]:
                edits.append(edits_each_date[date][1][pid])
            else:
                edits.append(0)
        bar_data.append(edits)

    graph_data = {'labels': dates, 'datasets': []}
    for i in range(len(bar_data)):
        bar = {'label': pids[i], 'data': bar_data[i], 'backgroundColor': stack_color[i], 'borderWidth': 0}
        graph_data['datasets'].append(bar)

    console.log(graph_data)
    return graph_data


def plot_top_users(result):
    dates = []
    pids = []

    edits_each_date = result["top_n_users"]

    for key in edits_each_date:
        dates.append(key)

    for date in dates:
        for pid in edits_each_date[date][1]:
            if (pid not in pids) and (pid != "null"):
                pids.append(pid)

    bar_data = []
    stack_color = generate_category_colors(len(pids))
    for pid in pids:
        edits = []
        for date in dates:
            if pid in edits_each_date[date][1]:
                edits.append(edits_each_date[date][1][pid])
            else:
                edits.append(0)
        bar_data.append(edits)

    graph_data = {'labels': dates, 'datasets': []}
    for i in range(len(bar_data)):
        bar = {'label': pids[i], 'data': bar_data[i], 'backgroundColor': stack_color[i], 'borderWidth': 0}
        graph_data['datasets'].append(bar)

    console.log(graph_data)
    return graph_data
