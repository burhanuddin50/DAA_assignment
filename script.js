function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
var desc=document.getElementById('desc-container');
var random=document.getElementById('generate');
var points=[];
  var visualizationContainer = document.getElementById('visualization-container');
  var svgContainer = document.getElementById('svg-container');
    visualizationContainer.addEventListener('click', function(event) {
      var dot = createDot(event.offsetX, event.offsetY);
      visualizationContainer.appendChild(dot);
    }); 
    desc.innerText="Click on the visualization area to plot points, set execution speed, and select an algorithm (Jarvis March or Kirkpatrick–Seidel) before clicking 'Execute'.";
    function createDot(x, y) {
      var dot = document.createElement('div');
      dot.className = 'dot';
      dot.id='x'+x+'y'+y;
      dot.style.left = (x - 5) + 'px'; 
      dot.style.top = (y - 5) + 'px';
      points.push({x,y});
      return dot;
    }
random.addEventListener('click',function(event){
      let np=document.getElementById('rand').value;
      for(let i=0 ; i<np; i++)
      {
      let xr= Math.random()*1400;
      let yr=Math.random()*400;
      var dot = createDot(xr,yr);
      visualizationContainer.appendChild(dot);
      }
    }); 
function findLeftmostPoint(pts) {
      if (points.length === 0) {
          return null; 
      }
      var ans=0;
      var leftmostPoint = pts[0];
      for (var i = 1; i < pts.length; i++) {
          if (pts[i].x < leftmostPoint.x) {
              leftmostPoint = pts[i];
              ans=i;
          }
      }
      return ans;
  }
function markpoint(pts,color)
{
  
  var pt=document.getElementById('x'+Math.abs(pts.x)+'y'+Math.abs(pts.y));
  if(pt.style.backgroundColor!="red")
  pt.style.backgroundColor=color;
}
function unmarkpoint(pts)
{
  var pt=document.getElementById('x'+Math.abs(pts.x)+'y'+Math.abs(pts.y));
  if(pt.style.backgroundColor!="red")
  pt.style.backgroundColor="black";
}
var clear=document.getElementById('clear-button');
clear.addEventListener('click', function(event) {
  var dots = document.querySelectorAll('.dot');
  dots.forEach(function(dot) {
      dot.parentNode.removeChild(dot);
  });
  points.length=0;
  desc.innerText="";
  var lines= document.querySelectorAll('.line');
  lines.forEach(function(l){
    l.parentNode.removeChild(l);
  })
  });
function connectDots(pts1,pts2,color) {
  x1=Math.abs(pts1.x);
  x2=Math.abs(pts2.x);
  y1=Math.abs(pts1.y);
  y2=Math.abs(pts2.y);
  var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.id="x1"+x1+"y1"+y1+"x2"+x2+"y2"+y2+"c"+color;
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke",color); // Adjust color as needed
    line.setAttribute("class", "line");
    svgContainer.appendChild(line);
  
  }
function drawline(x)
{
  var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.id="x1"+x+"y1"+"0"+"x2"+x+"y2"+"498"+"c"+"black";
  line.setAttribute("x1", x);
  line.setAttribute("y1", 0);
  line.setAttribute("x2", x);
  line.setAttribute("y2", 498);
  line.setAttribute("stroke","black"); // Adjust color as needed
  line.setAttribute("class", "line");
  svgContainer.appendChild(line);
}
function disconnect(pts1,pts2,color)
{
   let lineid="x1"+Math.abs(pts1.x)+"y1"+Math.abs(pts1.y)+"x2"+Math.abs(pts2.x)+"y2"+Math.abs(pts2.y)+"c"+color;
   var lin=document.getElementById(lineid);
   svgContainer.removeChild(lin);
}
function eraseline(x)
{
  let lineid="x1"+x+"y1"+"0"+"x2"+x+"y2"+"498"+"c"+"black";
   var lin=document.getElementById(lineid);
   svgContainer.removeChild(lin);
}
var execute=document.getElementById('execute-button');
function direct(p, q, r) {
  let val = (-q.y + p.y) * (r.x - q.x) - (q.x - p.x) * (-r.y + q.y);
  if (val == 0) return 0; // Collinear
  return (val > 0) ? 1 : 2; // Clockwise or Counterclockwise
}
async function jarvis(speed)
{
  let n=points.length;
  if(n<3)
  {
    desc.innerText="Convex Hull Not Possible";
    return [];
  }
  var leftmostpoint=findLeftmostPoint(points);
  markpoint(points[leftmostpoint],"red");
  desc.innerText="Locating the leftmost point to start forming the convex hull, marked RED";
  await sleep(speed);
  let hull=[];
  let p=leftmostpoint,q;
  do {
    hull.push(points[p]);
    markpoint(points[p],"red");
    desc.innerText="Examining points to construct the convex hull. The current point on the hull is RED, the next potential point is GREEN, and the line being considered is BLUE.";
    await sleep(speed);
    q = (p + 1) % n;
    markpoint(points[q],"green");
    connectDots(points[p],points[q],"blue");
    await sleep(speed);
    desc.innerText="Comparing angles to find the next point in the convex hull. Temporary lines are drawn in yellow to evaluate each point.";
    for (let i = 0; i < n; i++) {
      //  if(hull.includes(points[i]))
      //  continue;
       if(i==q)
       continue;
       if(!(hull.includes(points[i])))
        markpoint(points[i],"blue");
        connectDots(points[q],points[i],"yellow");
        await sleep(speed);
        // If i is more counterclockwise than current q, then update q
        if (direct(points[p], points[i], points[q]) === 1) 
        {
          if(!(hull.includes(points[q])))
          unmarkpoint(points[q]);
          disconnect(points[p],points[q],"blue");
          disconnect(points[q],points[i],"yellow");
          await sleep(speed);
          q = i;
          if(!(hull.includes(points[q])))
          markpoint(points[q],"green");
          connectDots(points[p],points[q],"blue");
          await sleep(speed);
        }
        else{
        if(!(hull.includes(points[i])))
        unmarkpoint(points[i]);
        disconnect(points[q],points[i],"yellow");}
        if(hull.includes(points[i]))
        markpoint(points[i],"red");
        await sleep(speed);
    }
    p = q;
} while (p !== leftmostpoint);
markpoint(points[leftmostpoint],"red");
desc.innerText="Completed forming the convex hull. All points on the hull are marked in red, with the hull boundary outlined in blue";
}
async function bridge(points1, vertical_line,speed) {
  let points=[...points1];
  let candidates = [];
  if (points.length === 2) {
      return points.sort((a, b) => a.x - b.x);
  }
  if(points.length === 1)
  return [points[0],points[0]];
  let pairs = [];
  let modify_s = [...points];
  while (modify_s.length >= 2) {
      let pi = modify_s[0];
      modify_s.splice(0,1);
      let pj = modify_s[0];
      modify_s.splice(0,1);
      pairs.push([pi, pj].sort((a, b) => a.x - b.x));
  }
   for(let i=0; i<pairs.length; i++)
   connectDots(pairs[i][0],pairs[i][1],"violet");
  if (modify_s.length === 1) {
      candidates.push(modify_s[0]);
      //markpoint(modify_s[0],"green");
  }   
  let slopes = [];
  for (let [pi, pj] of pairs) {
      if (pi.x === pj.x) {
          pairs = pairs.filter(pair => pair[0] !== pi && pair[1] !== pi);
          candidates.push(pi.y > pj.y ? pi : pj);
          //markpoint(pi.y > pj.y ? pi : pj,"green");
      } else {
          slopes.push((pi.y - pj.y) / (pi.x - pj.x));
      }
  }
  await sleep(speed);
  let median_index = Math.floor(slopes.length / 2) - (slopes.length % 2 === 0 ? 1 : 0);
  let slopes_dup=[...slopes];
  slopes_dup.sort();
  let median_slope = slopes_dup[median_index];
  let small = pairs.filter((_, i) => slopes[i] < median_slope);
  let equal = pairs.filter((_, i) => slopes[i] === median_slope);
  let large = pairs.filter((_, i) => slopes[i] > median_slope);
  let max_slope = Math.max(...points.map(point => point.y - median_slope * point.x));
  let max_set = points.filter(point => point.y - median_slope * point.x === max_slope);
  let left = max_set.reduce((min, point) => point.x < min.x ? point : min);
  let right = max_set.reduce((max, point) => point.x > max.x ? point : max);
  //markpoint(left,"yellow");
  //markpoint(right,"yellow");
 // await sleep(2000);
  for(let i=0; i<pairs.length; i++)
  disconnect(pairs[i][0],pairs[i][1],"violet");
  if (left.x <= vertical_line && right.x > vertical_line) {
    // await sleep(200);
      //for(let i=0; i<candidates.length; i++)
      //markpoint(candidates[i],"blue");
     // await sleep(200);
      return [left, right];
  }
  if (right.x <= vertical_line) {
      for (let pair of large.concat(equal)) {
          candidates.push(pair[1]);
          //markpoint(pair[1],"green");
      }
      for (let pair of small) {
          candidates.push(pair[0]);
          candidates.push(pair[1]);
          //markpoint(pair[1],"green");
          //markpoint(pair[0],"green");
      }
  }
  if (left.x > vertical_line) {
      for (let pair of small.concat(equal)) {
          candidates.push(pair[0]);
          //markpoint(pair[0],"green");
      }
      for (let pair of large) {
          candidates.push(pair[1]);
          candidates.push(pair[0]);
          //markpoint(pair[1],"green");
          //markpoint(pair[0],"green");
      }
  }
  for(let i=0; i<candidates.length; i++)
  markpoint(candidates[i],"green");
  await sleep(speed);
  for(let i=0; i<candidates.length; i++)
  markpoint(candidates[i],"blue");
  await sleep(speed);
  return await bridge([...candidates], vertical_line,speed);
}
function flippedy(points)
{
  let fp=[];
  for(let i=0; i<points.length; i++)
  {
  let x=points[i].x;
  let y=-points[i].y;
  fp.push({x,y});
  }
  return fp;
}
async function connect(lower ,upper ,points,speed)
{
  let npoints= points.filter( p=> p.x>=lower.x && p.x <=upper.x);
  let nnpoints=await eliminatebelow(lower, upper, npoints);
  let n=nnpoints.length;
   if( lower==upper)
   return [lower];
  if(n!=2)
  {
  connectDots(lower,upper,"green");
   await sleep(speed);
  }
  for(let i=0; i<nnpoints.length; i++)
  {
       markpoint(nnpoints[i],"blue");
  }
  console.log(upper);
  if(n!=2)
  {
   await sleep(speed);
  disconnect(lower,upper,"green");
  await sleep(speed);}
  nnpoints.sort((a, b) => a.x - b.x);
  let max_left=nnpoints[Math.floor(n/2)-1];
  let min_right=nnpoints[Math.floor(n/2)];
  if(n!=2){
  drawline((max_left.x + min_right.x)/2);
  await sleep(speed);}
  let ans=await bridge([...nnpoints],(max_left.x + min_right.x)/2,speed); 
  markpoint(ans[0],"red");
  markpoint(ans[1],"red");
  if(n!=2)
  {
  await sleep(speed);
  eraseline((max_left.x + min_right.x)/2);
  await sleep(speed);
  if(ans[0]!=ans[1])
  {connectDots(ans[0],lower,"green");
  connectDots(ans[1],upper,"green");
  connectDots(lower,upper,"green");
  connectDots(ans[0],ans[1],"green");
  await sleep(speed);
  disconnect(ans[0],lower,"green");
  disconnect(ans[1],upper,"green");
  disconnect(lower,upper,"green");
  disconnect(ans[0],ans[1],"green");}
  }
  let points_left=[ans[0]];
  let points_right=[ans[1]];
  for(let i=0; i<nnpoints.length; i++)
  {
      if(nnpoints[i].x<ans[0].x)
      points_left.push(nnpoints[i]);
      else if(nnpoints[i].x>ans[1].x)
      points_right.push(nnpoints[i]);
      unmarkpoint(nnpoints[i]);
  }
  if(n!=2)
  await sleep(speed);
  return (await connect(lower, ans[0], [...points_left],speed)).concat(await connect(ans[1],upper, [...points_right],speed));
}
function isBelowLine(point, upperPoint, lowerPoint) {
  if(point==upperPoint || point== lowerPoint)
  return false;
  const m = (upperPoint.y - lowerPoint.y) / (upperPoint.x - lowerPoint.x);
  const c = upperPoint.y - m * upperPoint.x;
  const lineY = m * point.x + c;
  return point.y < lineY;
}
function eliminatebelow(lowerPoint , upperPoint, points) {
  return points.filter(point => !isBelowLine(point, upperPoint, lowerPoint));
}
async function upperhull(points,speed)
{
    let lower= points[0];
    for( let i=1; i<points.length; i++)
    {
      if(points[i].x<lower.x)
      lower=points[i];
      else if(points[i].x==lower.x && points[i].y>lower.y)
      lower=points[i];
    }
    let upper=points[0];
    for( let i=1; i<points.length; i++)
    {
      if(points[i].x>upper.x)
      upper=points[i];
      else if(points[i].x==upper.x && points[i].y>upper.y)
      upper=points[i];
    }
    markpoint(lower,"red");
    markpoint(upper,"red");
    await sleep(speed);
    return connect(lower,upper,points,speed);
}
function flipped(points)
{
  let npoints=[];
   for(let i=0; i<points.length; i++)
   {
    let x= -points[i].x;
    let y= -points[i].y;
    npoints.push({x,y});
   }
  return npoints;
}
async function kps(speed)
{
    // points=[{x: 486, y: 337},{x: 429, y: 235},{x: 559, y: 233},{x: 473, y: 250},{x: 596, y: 308},{x: 711, y: 290},{x: 676, y: 207},{x: 661, y: 306},{x: 723, y: 233},{x: 680, y: 133},{x: 602, y: 133},{x: 604, y: 224},{x: 722, y: 177},{x: 565, y: 178},{x: 648, y: 184},{x: 533, y: 154},{x: 496, y: 225},{x: 533, y: 297},{x: 519, y: 226},{x: 549, y: 261},{x: 649, y: 263},{x: 643, y: 238},{x: 554, y: 293},{x: 492, y: 249}
    //   ,{x: 505, y: 199},
    //   {x: 523, y: 169},
    //   {x: 448, y: 233},
    //   {x: 473, y: 226},
    //   {x: 545, y: 311}]; 
    let npoints=flippedy(points);
    let upper=await upperhull(npoints,speed);
    let lower=flipped(await upperhull(flipped([...npoints]),speed));
    let answer =await upper.concat(lower); 
    desc.innerText="Finished";
    // for(let i=0; i<answer.length; i++)
    // markpoint(answer[i],"red");
}
execute.addEventListener('click',function(event) {
      let speed=document.getElementById("speed").value;
      let choice=document.getElementById("algorithm-select").value;
      if(choice=="option1")
      jarvis(speed);
      else
      kps(speed);
  })
