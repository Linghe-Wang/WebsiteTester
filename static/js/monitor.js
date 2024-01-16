let serverURL;
serverURL = "http://127.0.0.1:5001/";

var content;
let projectIDs = null;
let diff_htmls = null;
let projectIndex = 0;
let slider = null;
let contentDisplay = null;
let events= [];
let min = 0;
let max = 0;
var info = [];

document.addEventListener('DOMContentLoaded', function() {
    serverURL = sessionStorage.getItem('serverURL');
    var temp = sessionStorage.getItem('projectID');
    var writer_action_idx = sessionStorage.getItem('writer_action_idx');
    if (temp !== ""){
        console.log(temp);
        document.getElementById("projectID").value = temp;
        document.getElementById("writer_action_idx").value = writer_action_idx;
        retrieveProject();
    }
    // slider = document.getElementById("player");
    contentDisplay = document.getElementById("displayContent");
    // slider.addEventListener("input", event => {
    //     var idx = event.target.value;
    //     // contentDisplay.textContent = content[idx][2];
    //     contentDisplay.innerHTML = diff_htmls[projectIndex][idx]
    // });
});

function addButtons(){
    var buttonsDiv = document.querySelector('.buttons');
    var numberOfButtons = projectIDs.length;
    for (var i = 0; i < numberOfButtons; i++) {
      var button = document.createElement('button');
      button.textContent = projectIDs[i].slice(0, 6)+"..."+projectIDs[i].slice(-6);
      button.value = i;
//      button.textContent = projectIDs[i];
      buttonsDiv.appendChild(button);
    }
    var buttonsWithValue  = document.querySelectorAll('button[value]');
    buttonsWithValue.forEach(button => {
        button.addEventListener('click', function() {
        projectIndex = button.value;
        console.log(projectIndex);
        resetSlider();
        slider.max = diff_htmls[projectIndex].length-1;
        contentDisplay.innerHTML = diff_htmls[projectIndex][0];
        });
    });
};

async function retrieveProject() {
  var text = document.getElementById("projectID").value;
  var writer_action_idx = document.getElementById("writer_action_idx").value;
  var writer_action_offset = 50;
  if (0 < min && min < 50){
    writer_action_offset = min
  }
  const object = {projectID: text, writer_action_idx: parseInt(writer_action_idx), writer_action_offset: writer_action_offset};
  try {
       const response = await fetch(serverURL + "/create", {
          // mode: 'no-cors',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(object),
       });
      const message = await response.json();
      console.log(message);
      if (message.status == "ok"){
          console.log(message)
          // projectIDs = message.projectIDs;
          // diff_htmls = message.diff_htmls;
          // slider.max = diff_htmls[0].length-1;
          
          // contentDisplay.innerHTML = diff_htmls[projectIndex][0];
          contentDisplay.innerHTML = message.info[0]['htmls']
          // addButtons();
      }
      var temp_info = message.info
      var temp_min = message.min
      var temp_max = message.max
      var temp_events = []

      for (let i = 0; i < temp_info.length; i++) {
        console.log(temp_info[i]['actions'])
        description = "file: " + temp_info[i]['actions']['file'] + "\n" + 
                      "timestamp: " + temp_info[i]['actions']['timestamp']
        temp_events.push({user: temp_info[i]['users'], description: description})
      }

      if (temp_max == min){
        events = temp_events.concat(events);
        info = temp_info.concat(info);
        min = temp_min;
        currentIndex = Math.ceil(temp_events.length / eventsPerPage);
      }
      else if (temp_min == max){
        events = events.concat(temp_events);
        info = info.concat(temp_info);
        max = temp_max;
      }
      else{
        events = temp_events;
        info = temp_info;
        min = temp_min;
        max = temp_max;
      }

      loadEvents(true);
      // Automatically click the first event
      $('.timeline__event-indicator').eq(0).click();
  }
  catch (err){
      console.log(err);
      console.log('failed to fetch');
  }
};

// $(document).ready(function() {
    // Replace `projectId` with the actual project ID that generates events
    var projectId = 'your_project_id';
    var eventsPerPage = 4;
    var currentIndex = 0;
    var globalIndex = 0;
    var currentIndex;

    // Load events dynamically based on the project ID
    // loadEvents(projectId, true);
  
    async function loadEvents(clickFirstEvent) {
      // Replace this code with your logic to fetch events based on the project ID
      // Here, we assume that you have an array of events with their respective years and descriptions
      // Modify this array to match the events you want to display  
      var timelineEvents = $('#timeline-events');
  
      // Clear existing events
      timelineEvents.empty();
  
      // Calculate the start and end indexes based on the current page
      // var startIndex = currentIndex * eventsPerPage;
      var startIndex = currentIndex * eventsPerPage;
      var endIndex = startIndex + eventsPerPage;
      
      if (startIndex < 0 && min !=0){
        document.getElementById("writer_action_idx").value = Math.max(min - 50, 0);
        await retrieveProject();
        return;
      }
      else if (endIndex >= (events.length - 1)){
        document.getElementById("writer_action_idx").value = max;
        await retrieveProject();
        return;
      }

      // Create event elements dynamically
      for (var i = startIndex; i < endIndex && i < events.length; i++) {
        var event = events[i];
        var eventItem = $('<li class="timeline__event"></li>');
        var eventIndicator = $('<a class="timeline__event-indicator"></a>');
        var eventTime = $('<time class="timeline__event__time">' + event.user + '</time>');
        var eventTooltip = $('<div class="timeline__tooltip"></div>');
        var tooltipContainer = $('<div class="timeline__tooltip-container"></div>');
        // var tooltipClose = $('<span class="timeline__tooltip-close">close</span>');
        var tooltipContent = $('<span class="timeline__tooltip-content">' + event.description + '</span>');

        // tooltipContainer.append(tooltipClose);
        tooltipContainer.append(tooltipContent);
        eventTooltip.append(tooltipContainer);
  
        eventItem.append(eventIndicator);
        eventItem.append(eventTime);
        eventItem.append(eventTooltip);
  
        timelineEvents.append(eventItem);
      }
  
      // Update the pager visibility based on the current page
      updatePagerVisibility(events.length);
    }
  
    function updatePagerVisibility(totalEvents) {
      var timelinePagerPrev = $('.timeline-pager__previous');
      var timelinePagerNext = $('.timeline-pager__next');
  
      if (min === 0 && currentIndex === 0) {
        timelinePagerPrev.hide();
      } else {
        timelinePagerPrev.show();
      }
  
      if ((currentIndex + 1) * eventsPerPage >= totalEvents) {
        timelinePagerNext.hide();
      } else {
        timelinePagerNext.show();
      }
    }
  
    var slide = $('.timeline-slide');
    var currentSlide = slide.filter('.slide-is-active');
    var timelineEvent = $('.timeline__event-indicator');
  
    $('.timeline-pager__next').on('click', function() {
      currentIndex++;
      loadEvents(projectId);
    });
  
    $('.timeline-pager__previous').on('click', function() {
      currentIndex--;
      loadEvents(projectId);
    });
  
    // Event delegation for dynamically loaded events
    $(document).on('click', '.timeline__event-indicator', function() {
      var eventIndex = $(this).closest('.timeline__event').index() + currentIndex * eventsPerPage;
      $(this).closest('.timeline').find('.timeline__event').removeClass('is-active');
      $(this).closest('.timeline__event').addClass('is-active');
      console.log(eventIndex);
      getCurrentEvent(eventIndex);
    });
  
    $('.timeline__tooltip-close').on('click', function() {
      $(this).closest('.timeline__event').removeClass('is-active');
    });
  
    $(document).mouseup(function(e) {
      var timelineTooltip = $('.timeline__tooltip');
  
      // if the target of the click isn't the container nor a descendant of the container
      if (!timelineTooltip.is(e.target) && timelineTooltip.has(e.target).length === 0) {
        timelineTooltip.parent().removeClass('is-active');
      }
    });

    function getCurrentEvent(index) {
      var activeEvent = $('.timeline__event.is-active');
      if (activeEvent.length > 0) {
        // var year = activeEvent.find('.timeline__event__time').text();
        // var description = activeEvent.find('.timeline__tooltip-content').text();
        // console.log(activeEvent)
        // console.log("year: " + year + " | description:   " + description)
        contentDisplay.innerHTML = info[index]['htmls']

        // return {
        //   year: year,
        //   description: description
        // };
      }
      // return null;
    }

    $(document).on('keydown', function(e) {
        if (e.keyCode === 37) {
        // Left arrow key
        navigateToPreviousEvent();
        } else if (e.keyCode === 39) {
        // Right arrow key
        navigateToNextEvent();
        }
    });

    async function navigateToPreviousEvent() {
      var prevEvent = $('.timeline__event.is-active').prev('.timeline__event');
      if (prevEvent.length > 0) {
        prevEvent.find('.timeline__event-indicator').click();
      } else {
        var prevSlide = currentSlide.prev('.timeline-slide');
        if (prevSlide.length) {
          currentSlide.removeClass('slide-is-active').addClass('slide-exit-right');
          currentSlide = prevSlide.addClass('slide-is-active').removeClass('slide-exit-left slide-exit-right');
          $('.timeline__event-indicator').last().click();
        } else {
          currentIndex--;
          if (currentIndex < 0 && min ==0) {
            currentIndex = 0;
          } else {
            await loadEvents(projectId);
            $('.timeline__event-indicator').last().click();
          }
        }
      }
      // console.log("CURRENT INDEX == " + currentIndex)
    }

      function navigateToNextEvent() {
        var nextEvent = $('.timeline__event.is-active').next('.timeline__event');
        if (nextEvent.length > 0) {
          nextEvent.find('.timeline__event-indicator').click();
        } else {
          var nextSlide = currentSlide.next('.timeline-slide');
          if (nextSlide.length) {
            currentSlide.removeClass('slide-is-active').addClass('slide-exit-left');
            currentSlide = nextSlide.addClass('slide-is-active').removeClass('slide-exit-left slide-exit-right');
          } else if (currentIndex < Math.ceil(events.length / eventsPerPage) - 1) {
            currentIndex++;
            loadEvents(projectId, true);
            $('.timeline__event-indicator').eq(0).click();
          }
        }
      }