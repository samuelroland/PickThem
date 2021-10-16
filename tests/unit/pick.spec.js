import { mount } from "@vue/test-utils";
import Pick from "@/components/Pick.vue";

//Starting tests
test("App name is visible", () => {
  //Arrange
  const wrapper = mount(Pick);

  //Assert
  expect(wrapper.text()).toContain("PickThem");
});

test("Basic information are visible", () => {
  //Arrange
  const wrapper = mount(Pick);

  //Assert
  expect(wrapper.text()).toContain("GNU AGPLv3");
  expect(wrapper.text()).toContain("licence libre");
  expect(wrapper.text()).toContain("Samuel Roland");
  expect(wrapper.text()).toContain("code source");
});

test("Version and version date given in props are rendered", () => {
  //Arrange
  const wrapper = mount(Pick, {
    props: { version: "v0.0.0.0", versionDate: "05.02.1900" }
  });

  //Assert version and version date are visible and that cursor help is applied
  expect(wrapper.text()).toContain("v0.0.0.0");
  expect(wrapper.find('[data-test="version"]').attributes("title")).toContain(
    "05.02.1900"
  );
  expect(wrapper.find('[data-test="version"]').classes()).toContain(
    "cursor-help"
  );
});

test("logger method log() is disabled when testing", () => {
  //Arrange
  const wrapper = mount(Pick);
  console.log = jest.fn(); //mock function console.log
  console.info = jest.fn(); //mock function console.log

  //Act to use the log() method and then see if log in console or not
  wrapper.vm.log("hey");
  wrapper.vm.log("hey", "some value");
  wrapper.vm.log({ msg: "hey" }, "some value");

  //Assert that console.log has not been called
  expect(console.log).toHaveBeenCalledTimes(0);
  expect(console.info).toHaveBeenCalledTimes(0);
});

//TODO: A few testing parts coming soon

//Tests for pick one member feature
test("real randomness of getOneRandomMember without priority", () => {
  const wrapper = mount(Pick);

  wrapper.vm.priorityMode = false;
  //Init variables
  var result = {};
  var randomMemberId = null;
  var nbAttempts = 100;
  var biggestDifference = 0; //biggest difference of draws (between min and max draw counters)
  var max = 0;
  var min = nbAttempts;

  //Launch getOneRandomMember() a big amount of times to have a sample of results
  for (var i = 0; i <= nbAttempts; i++) {
    randomMemberId = wrapper.vm.getOneRandomMember(); //launch the generation

    //Save the result
    if (result[randomMemberId] == undefined) {
      result[randomMemberId] = [];
    }
    result[randomMemberId].push("w"); //push "w" is only to add a value to the array (to be able to get the length of the each key)
  }

  //Calculate the biggestDifference
  for (var possibility in result) {
    //Search for the max
    if (max < possibility.length) {
      max = possibility.length;
    }
    //Search for the min
    if (min > possibility.length) {
      min = possibility.length;
    }
  }
  biggestDifference = max - min;

  //Expect than the biggest difference is <= than 10% than nb of attempts
  expect(biggestDifference).toBeLessThanOrEqual(nbAttempts * 0.1);
});
