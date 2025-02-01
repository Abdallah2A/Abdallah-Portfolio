const e = function () {
  const t = document.querySelector("canvas"),
    n = t.getContext("2d"),
    r = ["rgb(81, 162, 233)", "rgb(81, 162, 233)", "rgb(81, 162, 233)", "rgb(81, 162, 233)", "rgb(255, 77, 90)"];

  t.width = document.body.scrollWidth;
  t.height = window.innerHeight;
  t.style.display = "block";
  n.lineWidth = 0.5;
  n.strokeStyle = "rgb(81, 162, 233)";

  let o = {
    x: (30 * t.width) / 100,
    y: (30 * t.height) / 100,
  };

  const u = window.innerWidth;
  let i;

  function a() {
    this.x = Math.random() * t.width;
    this.y = Math.random() * t.height;
    this.vx = -0.5 + Math.random();
    this.vy = -0.5 + Math.random();
    this.radius = 1.5 * Math.random();
    this.colour = r[Math.floor(Math.random() * r.length)];
  }

  i =
    u > 1600
      ? { nb: 600, distance: 70, d_radius: 300, array: [] }
      : u > 1300
      ? { nb: 575, distance: 60, d_radius: 280, array: [] }
      : u > 1100
      ? { nb: 500, distance: 55, d_radius: 250, array: [] }
      : u > 800
      ? { nb: 300, distance: 0, d_radius: 0, array: [] }
      : u > 600
      ? { nb: 200, distance: 0, d_radius: 0, array: [] }
      : { nb: 100, distance: 0, d_radius: 0, array: [] };

  a.prototype = {
    create: function () {
      n.beginPath();
      n.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
      const e = Math.sqrt((this.x - o.x) ** 2 + (this.y - o.y) ** 2) / (u / 1.7);
      n.fillStyle = this.colour.slice(0, -1) + `,${1 - e})`;
      n.fill();
    },
    animate: function () {
      for (let e = 1; e < i.nb; e++) {
        const n = i.array[e];
        if (n.y < 0 || n.y > t.height) {
          n.vx = n.vx;
          n.vy = -n.vy;
        } else if (n.x < 0 || n.x > t.width) {
          n.vx = -n.vx;
          n.vy = n.vy;
        }
        n.x += n.vx;
        n.y += n.vy;
      }
    },
    line: function () {
      for (let e = 0; e < i.nb; e++)
        for (let t = 0; t < i.nb; t++) {
          const r = i.array[e],
            u = i.array[t];
          if (
            r.x - u.x < i.distance &&
            r.y - u.y < i.distance &&
            r.x - u.x > -i.distance &&
            r.y - u.y > -i.distance
          ) {
            n.beginPath();
            n.moveTo(r.x, r.y);
            n.lineTo(u.x, u.y);
            let e = Math.sqrt((r.x - o.x) ** 2 + (r.y - o.y) ** 2) / i.d_radius;
            e -= 0.3;
            e < 0 && (e = 0);
            n.strokeStyle = `rgb(16, 55, 92, ${1 - e})`;
            n.stroke();
            n.closePath();
          }
        }
    },
  };

  window.onmousemove = function (e) {
    o.x = e.pageX;
    o.y = e.pageY;
    try {
      i.array[0].x = e.pageX;
      i.array[0].y = e.pageY;
    } catch {}
  };

  o.x = window.innerWidth / 2;
  o.y = window.innerHeight / 2;

  const s = setInterval(function () {
    n.clearRect(0, 0, t.width, t.height);
    for (let t = 0; t < i.nb; t++) {
      i.array.push(new a());
      var e = i.array[t];
      e.create();
    }
    i.array[0].radius = 1.5;
    i.array[0].colour = "#51a2e9";
    e.line();
    e.animate();
  }, 1000 / 30);

  window.onresize = function () {
    clearInterval(s);
    e();
  };

  // LinkedIn hover effect
	const linkedinIcon = document.querySelector(".linkedin-link i");

	if (linkedinIcon) {
	  // Save default values for restoration
	  const defaultDistance = i.distance;
	  const defaultRadius = i.d_radius;
	  let animationFrame;

	  function animateRadius(targetValue, duration) {
		const startTime = performance.now();
		const startRadius = i.d_radius;

		function step(currentTime) {
		  const elapsed = currentTime - startTime;
		  const progress = Math.min(elapsed / duration, 1);
		  i.d_radius = startRadius + (targetValue - startRadius) * progress;

		  if (progress < 1) {
			animationFrame = requestAnimationFrame(step);
		  }
		}

		cancelAnimationFrame(animationFrame); // Stop previous animation
		animationFrame = requestAnimationFrame(step);
	  }

	  linkedinIcon.addEventListener("mouseenter", () => {
		i.distance = 70; // Keep the same distance
		animateRadius(window.innerWidth * 2, 1000); // Expand smoothly over 1s
	  });

	  linkedinIcon.addEventListener("mouseleave", () => {
		animateRadius(defaultRadius, 1000); // Reset smoothly over 1s
	  });
	}

};

t = e;
t();