# frozen_string_literal: true

require 'stack'

def test_stack(stack, stack_type)
  describe stack_type do
    it 'should push, pop, and peek items properly' do
      stack.push(1)
      stack.push(2)
      stack.push(3)

      expect(stack.peek).to eq 3
      expect(stack.size).to eq 3

      expect(stack.pop).to eq 3
      expect(stack.to_array).to eq [1, 2]

      stack.push(4)
      stack.push(5)
      stack.push(6)

      expect(stack.to_array).to eq [1, 2, 4, 5, 6]

      stack.clear

      expect(stack.empty?).to be true
      expect { stack.peek }.to raise_error('Stack is empty')
      expect { stack.pop }.to raise_error('Stack is empty')
    end
  end
end

stack = DataStructures::ArrayStack.new
test_stack(stack, 'Array Stack')

stack = DataStructures::LinkedStack.new
test_stack(stack, 'Linked Stack')
