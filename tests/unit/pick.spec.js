import { mount } from "@vue/test-utils";
import Pick from "@/components/Pick.vue";

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
